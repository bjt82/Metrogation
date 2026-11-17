/**
 * 메트로게이션(Metrogation) 교통약자 맞춤 경로 탐색 엔진
 */
(function () {
  const PROFILES = {
    wheelchair: {
      id: 'wheelchair',
      title: '♿ 휠체어 · 유모차',
      subtitle: '계단·에스컬레이터 제외',
      eyeHeight: 1.15,
      speedMetersPerMin: 50
    },
    visual: {
      id: 'visual',
      title: '🦯 시각장애인',
      subtitle: '점자블록·안전 동선 우선',
      eyeHeight: 1.58,
      speedMetersPerMin: 45
    },
    senior: {
      id: 'senior',
      title: '🦯 고령자 · 보행약자',
      subtitle: '엘리베이터·완만 경로 우선',
      eyeHeight: 1.55,
      speedMetersPerMin: 48
    },
    general: {
      id: 'general',
      title: '🚶 일반 최단 경로',
      subtitle: '최단 거리 기준',
      eyeHeight: 1.62,
      speedMetersPerMin: 70
    }
  };

  function dist3D(a, b) {
    return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  }

  function floorFromY(station, y) {
    let best = station.floors[0];
    let minDiff = Infinity;
    station.floors.forEach((f) => {
      const diff = Math.abs(f.y - y);
      if (diff < minDiff) {
        minDiff = diff;
        best = f;
      }
    });
    return best;
  }

  function edgeWeight(edge, profileId, nodes) {
    const [u, v, type, isTactile] = edge;
    const base = dist3D(nodes[u], nodes[v]);

    if (profileId === 'wheelchair') {
      if (type === 'st' || type === 'es') return Infinity;
      if (type === 'el') return base * 1.2;
      return base;
    }
    if (profileId === 'visual') {
      if (type === 'es') return base * 3.5;
      if (type === 'st') return base * 1.45;
      if (type === 'el') return base * 1.15;
      return isTactile ? base : base * 1.7;
    }
    if (profileId === 'senior') {
      if (type === 'st') return base * 4.2;
      if (type === 'es') return base * 1.8;
      if (type === 'el') return base * 1.1;
      return base;
    }
    // general
    if (type === 'el') return base * 1.4;
    return base;
  }

  function findRoute(station, startId, endId, profileId) {
    const nodes = station.nodes;
    const edges = station.edges;
    const profile = PROFILES[profileId] || PROFILES.wheelchair;

    if (!nodes[startId] || !nodes[endId]) {
      return null;
    }

    const dist = {};
    const prev = {};
    const prevEdge = {};
    const todo = new Set(Object.keys(nodes));

    Object.keys(nodes).forEach((k) => {
      dist[k] = Infinity;
    });
    dist[startId] = 0;

    while (todo.size > 0) {
      let u = null;
      todo.forEach((k) => {
        if (u === null || dist[k] < dist[u]) u = k;
      });
      if (u === null || dist[u] === Infinity || u === endId) break;
      todo.delete(u);

      edges.forEach((e) => {
        const v = e[0] === u ? e[1] : e[1] === u ? e[0] : null;
        if (!v || !todo.has(v)) return;
        const w = edgeWeight(e, profile.id, nodes);
        if (w === Infinity) return;
        const alt = dist[u] + w;
        if (alt < dist[v]) {
          dist[v] = alt;
          prev[v] = u;
          prevEdge[v] = e;
        }
      });
    }

    if (dist[endId] === Infinity) return null;

    const path = [endId];
    while (path[0] !== startId) {
      path.unshift(prev[path[0]]);
    }

    let rawLen = 0;
    let elevatorCount = 0;
    let stairCount = 0;
    let escalatorCount = 0;
    let tactileLen = 0;

    for (let i = 1; i < path.length; i++) {
      const a = path[i - 1];
      const b = path[i];
      const segLen = dist3D(nodes[a], nodes[b]);
      rawLen += segLen;
      const e = prevEdge[b];
      if (e) {
        if (e[2] === 'el') elevatorCount++;
        if (e[2] === 'st') stairCount++;
        if (e[2] === 'es') escalatorCount++;
        if (e[3]) tactileLen += segLen;
      }
    }

    const totalMeters = Math.max(5, Math.round(rawLen * 2.2));
    const minutes = Math.max(1, Math.round(totalMeters / profile.speedMetersPerMin));
    const tactileRatio = rawLen > 0 ? Math.round((tactileLen / rawLen) * 100) : 100;

    const steps = path.map((nodeId, idx) => {
      const n = nodes[nodeId];
      const fl = floorFromY(station, n[1]);
      return {
        nodeId,
        floorKey: fl.key,
        floorColor: fl.color,
        label: n[3] || nodeId,
        detail: n[4] || '',
        pos: [n[0], n[1], n[2]],
        edgeType: idx > 0 && prevEdge[nodeId] ? prevEdge[nodeId][2] : 'start'
      };
    });

    let warning = '';
    if (profile.id === 'wheelchair') {
      const exitObj = station.exits.find((ex) => ex.id === startId || ex.id === endId);
      if (exitObj && !exitObj.hasElevator) {
        warning = `${exitObj.num}번 출구는 지상 직통 엘리베이터가 없는 출구입니다. 외부 승강기 연계 출구를 확인하세요.`;
      }
    } else if (profile.id === 'visual' && tactileRatio < 85) {
      warning = `일부 구간(${100 - tactileRatio}%)은 점자블록이 단절될 수 있으니 역무원 안내 또는 음성유도기를 참고하세요.`;
    }

    return {
      profile,
      path,
      steps,
      totalMeters,
      minutes,
      elevatorCount,
      stairCount,
      escalatorCount,
      tactileRatio,
      warning
    };
  }

  window.MetrogationRouting = {
    PROFILES,
    findRoute,
    floorFromY
  };
})();

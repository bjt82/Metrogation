/**
 * 메트로게이션(Metrogation) Three.js 3D 렌더링 및 1인칭 시뮬레이션 엔진
 */
(function () {
  function createEngine(container) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdfe6ec);
    scene.fog = new THREE.Fog(0xdfe6ec, 120, 260);

    const cam = new THREE.PerspectiveCamera(48, 1, 0.1, 500);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(cam, renderer.domElement);
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI * 0.88;
    controls.minDistance = 6;
    controls.maxDistance = 145;

    function fit() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
    }
    window.addEventListener('resize', fit);
    fit();

    // 조명
    scene.add(new THREE.HemisphereLight(0xfff4e6, 0x8a96a3, 0.88));
    const sun = new THREE.DirectionalLight(0xfff1dc, 1.08);
    sun.position.set(30, 60, 25);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -48, right: 48, top: 48, bottom: -48, near: 1, far: 160 });
    sun.shadow.bias = -0.0006;
    sun.shadow.radius = 3;
    scene.add(sun);

    [[0, 3.5, 3, 0.7, 34], [0, 9, 0, 0.6, 34], [0, 14.5, 0, 0.5, 40]].forEach((a) => {
      const l = new THREE.PointLight(0xfff0d8, a[3], a[4]);
      l.position.set(a[0], a[1], a[2]);
      scene.add(l);
    });

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(500, 500),
      new THREE.MeshStandardMaterial({ color: 0xcdd4da, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -3.4;
    ground.receiveShadow = true;
    scene.add(ground);

    // 텍스처 생성 유틸
    function makeTex(canvas, rx, ry) {
      const t = new THREE.CanvasTexture(canvas);
      t.encoding = THREE.sRGBEncoding;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(rx || 1, ry || 1);
      t.anisotropy = 8;
      return t;
    }

    function speck(g, n, s, a) {
      for (let i = 0; i < n; i++) {
        g.fillStyle = (Math.random() < 0.5 ? 'rgba(0,0,0,' : 'rgba(255,255,255,') + (Math.random() * a) + ')';
        g.fillRect(Math.random() * s, Math.random() * s, 1 + Math.random() * 2, 1 + Math.random() * 2);
      }
    }

    function tileTex(base, grout, rx, ry) {
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const g = c.getContext('2d');
      g.fillStyle = base;
      g.fillRect(0, 0, 256, 256);
      speck(g, 1800, 256, 0.16);
      g.strokeStyle = grout;
      g.lineWidth = 5;
      g.strokeRect(0, 0, 256, 256);
      return makeTex(c, rx, ry);
    }

    function concTex(rx, ry) {
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const g = c.getContext('2d');
      g.fillStyle = '#9fa2a5';
      g.fillRect(0, 0, 256, 256);
      speck(g, 3500, 256, 0.28);
      return makeTex(c, rx, ry);
    }

    function tactTex(rx, ry) {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const g = c.getContext('2d');
      g.fillStyle = '#facc15';
      g.fillRect(0, 0, 64, 64);
      g.fillStyle = '#b45309';
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          g.beginPath();
          g.arc(8 + i * 16, 8 + j * 16, 3.5, 0, Math.PI * 2);
          g.fill();
        }
      }
      return makeTex(c, rx || 1, ry || 1);
    }

    function bedTex() {
      const c = document.createElement('canvas');
      c.width = c.height = 128;
      const g = c.getContext('2d');
      g.fillStyle = '#4a4743';
      g.fillRect(0, 0, 128, 128);
      speck(g, 2400, 128, 0.45);
      g.fillStyle = '#6b6258';
      g.fillRect(0, 50, 128, 22);
      return makeTex(c, 26, 1);
    }

    function box(parent, w, h, d, x, y, z, color, opts) {
      const o = opts || {};
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: o.r !== undefined ? o.r : 0.7,
        metalness: o.m || 0,
        map: o.map || null,
        emissive: o.e || 0,
        emissiveIntensity: o.ei !== undefined ? o.ei : 1
      });
      if (o.o) {
        mat.transparent = true;
        mat.opacity = o.o;
        mat.depthWrite = false;
      }
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = !o.o;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    function slab(parent, w, d, y, z, colors) {
      const th = 0.9;
      const side = new THREE.MeshStandardMaterial({ map: concTex(w / 6, 1), roughness: 0.95 });
      const side2 = new THREE.MeshStandardMaterial({ map: concTex(d / 6, 1), roughness: 0.95 });
      const top = new THREE.MeshStandardMaterial({ map: tileTex(colors[0], colors[1], w / 2, d / 2), roughness: 0.35, metalness: 0.05 });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, th, d), [side2, side2, top, side, side, side]);
      mesh.position.set(0, y - th / 2, z);
      mesh.castShadow = mesh.receiveShadow = true;
      parent.add(mesh);
    }

    function sprMat(canvas) {
      const tex = new THREE.CanvasTexture(canvas);
      tex.encoding = THREE.sRGBEncoding;
      return new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true, toneMapped: false });
    }

    function pill(text, borderColor, scale) {
      const c = document.createElement('canvas');
      c.width = 420;
      c.height = 96;
      const g = c.getContext('2d');
      g.fillStyle = 'rgba(255,255,255,0.96)';
      g.strokeStyle = borderColor;
      g.lineWidth = 6;
      g.beginPath();
      if (g.roundRect) g.roundRect(4, 4, 412, 88, 20);
      else g.rect(4, 4, 412, 88);
      g.fill();
      g.stroke();
      g.fillStyle = '#17212b';
      g.font = '700 36px "Noto Sans KR", sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(text, 210, 50);
      const sp = new THREE.Sprite(sprMat(c));
      sp.scale.set(scale * 4.3, scale, 1);
      sp.renderOrder = 9;
      return sp;
    }

    function numTag(num, hasEv) {
      const c = document.createElement('canvas');
      c.width = c.height = 128;
      const g = c.getContext('2d');
      g.fillStyle = hasEv ? '#dcfce7' : '#ffd400';
      g.fillRect(6, 6, 116, 116);
      g.strokeStyle = hasEv ? '#15803d' : '#111';
      g.lineWidth = 6;
      g.strokeRect(6, 6, 116, 116);
      g.fillStyle = '#111';
      g.font = '900 72px "Noto Sans KR", sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(num, 64, hasEv ? 52 : 66);
      if (hasEv) {
        g.fillStyle = '#15803d';
        g.font = '900 26px "Noto Sans KR", sans-serif';
        g.fillText('E/V', 64, 102);
      }
      const sp = new THREE.Sprite(sprMat(c));
      sp.renderOrder = 9;
      return sp;
    }

    // 화살표 텍스처
    const chevCanvas = document.createElement('canvas');
    chevCanvas.width = 64;
    chevCanvas.height = 32;
    {
      const g = chevCanvas.getContext('2d');
      g.strokeStyle = '#ffffff';
      g.lineWidth = 7;
      g.lineCap = 'round';
      g.beginPath();
      g.moveTo(16, 5);
      g.lineTo(42, 16);
      g.lineTo(16, 27);
      g.stroke();
    }
    const chevTex = new THREE.CanvasTexture(chevCanvas);
    chevTex.wrapS = THREE.RepeatWrapping;

    // 상태 변수
    let stationGroup = null;
    let floorGroups = {};
    let elevatorCabs = [];
    let trainGroup = null;
    let tactileMeshes = [];
    let facilityMarkers = {};
    let exitTags = {};
    let activeFacilityRing = null;

    let routeGroup = null;
    let routeCurve = null;
    let routeRunner = null;
    let routeRings = [];
    let routeStartTime = 0;

    let flyGoal = null;
    controls.addEventListener('start', () => {
      flyGoal = null;
    });

    // 1인칭 시뮬레이션 상태
    const fpState = {
      active: false,
      paused: false,
      u: 0,
      eyeHeight: 1.15,
      onUpdate: null,
      onFinish: null
    };

    function flyTo(targetVec, posVec) {
      if (fpState.active) return;
      flyGoal = { t: targetVec.clone(), p: posVec.clone() };
    }

    function buildFlight(parent, s) {
      const n = 14;
      const len = Math.abs(s.x1 - s.x0) / n;
      const dy = (s.y1 - s.y0) / n;
      const dir = Math.sign(s.x1 - s.x0);
      const isEsc = s.type === 'escalator';
      const stepCol = isEsc ? 0x2b3036 : 0x8d9094;
      const noseCol = isEsc ? 0xb8bec4 : 0xd9b43a;
      const railCol = isEsc ? 0xb8bec4 : 0xc9ced2;

      for (let i = 0; i < n; i++) {
        const x = s.x0 + dir * (i + 0.5) * len;
        const y = s.y0 + (i + 0.5) * dy;
        box(parent, len, 0.3, s.w, x, y - 0.18, s.z, stepCol, { r: 0.5, m: 0.1 });
        box(parent, 0.12, 0.05, s.w * 0.98, x + dir * len * 0.44, y - 0.02, s.z, noseCol, { r: 0.5 });
      }

      const L = Math.hypot(s.x1 - s.x0, s.y1 - s.y0);
      const ang = Math.atan2(s.y1 - s.y0, s.x1 - s.x0);
      [s.z - s.w / 2, s.z + s.w / 2].forEach((zz) => {
        const p = box(parent, L, 0.9, 0.07, (s.x0 + s.x1) / 2, (s.y0 + s.y1) / 2 + 0.5, zz, railCol, { m: 0.85, r: 0.3 });
        p.rotation.z = ang;
        const h = box(parent, L, 0.07, 0.12, (s.x0 + s.x1) / 2, (s.y0 + s.y1) / 2 + 1.0, zz, 0x15181b, { r: 0.6 });
        h.rotation.z = ang;
      });
    }

    function loadStation(station) {
      if (stationGroup) scene.remove(stationGroup);
      if (routeGroup) {
        scene.remove(routeGroup);
        routeGroup = null;
      }
      stationGroup = new THREE.Group();
      scene.add(stationGroup);

      floorGroups = {};
      elevatorCabs = [];
      tactileMeshes = [];
      facilityMarkers = {};
      exitTags = {};
      activeFacilityRing = null;

      station.floors.forEach((f) => {
        const g = new THREE.Group();
        floorGroups[f.key] = g;
        stationGroup.add(g);

        const lbl = pill(f.key, f.color, 0.85);
        lbl.scale.set(2.8, 0.7, 1);
        lbl.position.set(-28, f.y + 1.2, -6.5);
        stationGroup.add(lbl);
      });

      // 층 바닥
      station.slabs.forEach((s) => {
        slab(floorGroups[s.floor] || stationGroup, s.w, s.d, s.y, s.z, s.colors);
      });

      // 기둥
      station.pillars.forEach(([x, z]) => {
        box(stationGroup, 0.6, 12.6, 0.6, x, 6.3, z, 0xb7babc, { map: concTex(1, 4), r: 0.9 });
      });

      // 선로, 스크린도어, 승강장 벽면
      const b3 = floorGroups.B3 || stationGroup;
      box(b3, station.track.length, 0.5, 3.0, 0, -1.45, 0, 0xffffff, { map: bedTex(), r: 1 });
      [-0.72, 0.72].forEach((z) => box(b3, station.track.length, 0.16, 0.12, 0, -1.05, z, 0xb9c0c7, { m: 0.9, r: 0.3 }));
      [-1.5, 1.5].forEach((z) => {
        box(b3, station.track.length, 2.3, 0.05, 0, 1.2, z, 0x9fc3d6, { o: 0.22, r: 0.1 });
        box(b3, station.track.length, 0.1, 0.1, 0, 2.35, z, 0xcfd4d8, { m: 0.8, r: 0.3 });
        for (let i = -13; i <= 13; i++) {
          box(b3, 0.1, 2.3, 0.1, i * 2, 1.2, z, 0xcfd4d8, { m: 0.8, r: 0.3 });
        }
      });

      box(b3, station.track.length, 5.1, 0.4, 0, 2.55, -6.2, 0xe9ebec, { map: tileTex('#e8eaea', '#c4c7c9', 26, 2.5), r: 0.4 });
      box(b3, station.track.length, 0.45, 0.42, 0, 1.6, -6.2, station.lineColorHex, { r: 0.5 });
      [-14, 14].forEach((x) => {
        const sp = pill(station.name, station.lineColor, 1.0);
        sp.scale.set(5.2, 1.3, 1);
        sp.position.set(x, 3.8, -5.8);
        b3.add(sp);
      });

      // 열차
      trainGroup = new THREE.Group();
      for (let i = 0; i < 5; i++) {
        const x = (i - 2) * 6.9;
        box(trainGroup, 6.6, 2.9, 2.7, x, 0, 0, 0xd5d9dd, { m: 0.75, r: 0.3 });
        box(trainGroup, 6.64, 0.95, 2.74, x, 0.5, 0, 0x1a2430, { m: 0.3, r: 0.15 });
        box(trainGroup, 6.64, 0.3, 2.74, x, -0.55, 0, station.track.trainColorHex, { r: 0.5 });
      }
      trainGroup.position.set(90, 0.45, 0);
      stationGroup.add(trainGroup);

      // 방면 안내판
      station.track.directions.forEach((d) => {
        const node = station.nodes[d.id];
        const y = node ? node[1] : 0;
        const targetGroup = floorGroups[window.MetrogationRouting.floorFromY(station, y).key] || b3;
        const lbl = pill(d.label, station.lineColor, 0.95);
        lbl.scale.set(4.8, 1.1, 1);
        lbl.position.set(d.x, y + 3.4, d.z);
        targetGroup.add(lbl);
      });

      // 점자블록
      station.tactileZones.forEach((tz) => {
        const grp = floorGroups[tz.floor] || stationGroup;
        const mesh = box(grp, tz.w, 0.05, tz.d, tz.x, tz.y, tz.z, 0xfacc15, {
          map: tactTex(Math.max(1, tz.w * 2), Math.max(1, tz.d * 2)),
          r: 0.5,
          e: 0x000000,
          ei: 0
        });
        tactileMeshes.push(mesh);
      });

      // 계단 / 에스컬레이터
      station.stairs.forEach((s) => {
        buildFlight(floorGroups[s.floor] || stationGroup, s);
      });

      // 엘리베이터
      station.elevators.forEach((el) => {
        const h = el.yMax - el.yMin + 0.4;
        const midY = (el.yMax + el.yMin) / 2;
        box(stationGroup, 2, h, 2, el.x, midY, el.z, 0xbfe0ee, { o: 0.22, r: 0.05 });
        const eg = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.BoxGeometry(2, h, 2)),
          new THREE.LineBasicMaterial({ color: 0x0284c7 })
        );
        eg.position.set(el.x, midY, el.z);
        stationGroup.add(eg);
        const cab = box(stationGroup, 1.6, 2.2, 1.6, el.x, el.yMin + 1.1, el.z, 0x38bdf8, { m: 0.6, r: 0.3 });
        elevatorCabs.push({ mesh: cab, yMin: el.yMin + 1.1, span: el.yMax - el.yMin - 1.2 });
        const lbl = pill('♿ ' + el.label, '#0284c7', 0.95);
        lbl.scale.set(4.2, 1.0, 1);
        lbl.position.set(el.x, el.yMax + 3.2, el.z);
        stationGroup.add(lbl);
      });

      // 개찰구 + 교통약자용 넓은 개찰구
      const b1 = floorGroups.B1 || stationGroup;
      const gCfg = station.gates;
      for (let i = -2; i <= 2; i++) {
        const idx = i + 2;
        const isWide = idx === gCfg.wideIndex;
        const zPos = i * 1.45;
        const bodyColor = isWide ? 0x0284c7 : 0xd3d7da;
        box(b1, 0.5, 1.05, 1.0, gCfg.x, gCfg.y + 0.52, zPos, bodyColor, { m: 0.6, r: 0.35 });
        box(b1, 0.1, 0.1, 0.1, gCfg.x, gCfg.y + 1.13, zPos + 0.3, isWide ? 0x38bdf8 : 0x37d36b, {
          e: isWide ? 0x38bdf8 : 0x37d36b
        });
      }
      const wideLbl = pill('♿ 넓은 개찰구', '#0284c7', 0.85);
      wideLbl.scale.set(3.4, 0.85, 1);
      wideLbl.position.set(gCfg.x, gCfg.y + 2.5, 0);
      b1.add(wideLbl);

      // 출구
      station.exits.forEach((ex) => {
        const sg = ex.z < 0 ? 1 : -1;
        box(b1, 2.8, 5.4, 2.8, ex.x, 12 + 2.7, ex.z, 0xb3b6b8, { map: concTex(1, 2), r: 0.9 });
        box(b1, 2.0, 3.0, 0.1, ex.x, 12 + 1.5, ex.z + sg * 1.43, 0x1c1f22, { r: 0.6 });
        box(b1, 2.4, 0.2, 0.3, ex.x, 12 + 3.2, ex.z + sg * 1.5, ex.hasElevator ? 0x16a34a : 0x2f9e5a);
        const tag = numTag(ex.num, ex.hasElevator);
        tag.position.set(ex.x, 12 + 6.8, ex.z);
        tag.scale.set(3.4, 3.4, 1);
        b1.add(tag);
        exitTags[ex.id] = tag;
      });

      // 교통약자 편의시설 3D 마커
      station.facilities.forEach((fac) => {
        const grp = floorGroups[fac.floor] || stationGroup;
        const [fx, fy, fz] = fac.pos;
        const colHex = parseInt(fac.color.replace('#', ''), 16);
        box(grp, 2.2, 2.2, 1.8, fx, fy + 1.1, fz, colHex, { r: 0.45, m: 0.2 });
        const lbl = pill(fac.icon, fac.color, 0.9);
        lbl.scale.set(3.8, 0.95, 1);
        lbl.position.set(fx, fy + 3.4, fz);
        grp.add(lbl);
        facilityMarkers[fac.id] = { pos: new THREE.Vector3(fx, fy, fz), color: colHex };
      });

      // 초기 카메라
      cam.position.set(...station.defaultCamera.pos);
      controls.target.set(...station.defaultCamera.target);
      controls.update();
    }

    function setTactileHighlight(enabled) {
      tactileMeshes.forEach((m) => {
        m.material.emissive.setHex(enabled ? 0xfacc15 : 0x000000);
        m.material.emissiveIntensity = enabled ? 0.55 : 0;
      });
    }

    function setFloorVisibility(floorKey, visible) {
      if (floorGroups[floorKey]) {
        floorGroups[floorKey].visible = visible;
      }
    }

    function highlightFacility(facId) {
      if (activeFacilityRing && stationGroup) {
        stationGroup.remove(activeFacilityRing);
        activeFacilityRing = null;
      }
      const marker = facilityMarkers[facId];
      if (!marker || !stationGroup) return;
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1.5, 2.1, 40),
        new THREE.MeshBasicMaterial({ color: marker.color, side: THREE.DoubleSide, transparent: true, depthTest: false })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.copy(marker.pos);
      ring.position.y += 0.25;
      ring.renderOrder = 8;
      stationGroup.add(ring);
      activeFacilityRing = ring;

      flyTo(
        marker.pos.clone().add(new THREE.Vector3(0, 1.2, 0)),
        marker.pos.clone().add(new THREE.Vector3(12, 11, 14))
      );
    }

    function makeRing(pos, color) {
      const r = new THREE.Mesh(
        new THREE.RingGeometry(0.9, 1.35, 40),
        new THREE.MeshBasicMaterial({ color, transparent: true, depthTest: false, side: THREE.DoubleSide })
      );
      r.rotation.x = -Math.PI / 2;
      r.position.copy(pos);
      r.position.y += 0.15;
      r.renderOrder = 7;
      return r;
    }

    function drawRoute(routeResult, startId, endId) {
      if (routeGroup) {
        scene.remove(routeGroup);
        routeGroup = null;
      }
      routeCurve = null;
      routeRunner = null;
      routeRings = [];

      Object.entries(exitTags).forEach(([id, sp]) => {
        const s = id === startId || id === endId ? 4.8 : 3.2;
        sp.scale.set(s, s, 1);
      });

      if (!routeResult || !routeResult.steps.length) return;

      const pts = routeResult.steps.map((s) => new THREE.Vector3(s.pos[0], s.pos[1] + 0.7, s.pos[2]));
      if (pts.length < 2) return;

      const dense = [];
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const n = Math.max(2, Math.ceil(a.distanceTo(b) / 2));
        for (let j = 0; j < n; j++) dense.push(a.clone().lerp(b, j / n));
      }
      dense.push(pts[pts.length - 1]);

      routeCurve = new THREE.CatmullRomCurve3(dense, false, 'catmullrom', 0.02);
      const L = routeCurve.getLength();

      routeGroup = new THREE.Group();
      const glow = new THREE.Mesh(
        new THREE.TubeGeometry(routeCurve, dense.length * 6, 0.18, 8, false),
        new THREE.MeshBasicMaterial({ color: 0x0a6cff, depthTest: false })
      );
      glow.renderOrder = 5;
      routeGroup.add(glow);

      chevTex.repeat.set(Math.max(1, L / 1.4), 1);
      const flow = new THREE.Mesh(
        new THREE.TubeGeometry(routeCurve, dense.length * 6, 0.34, 8, false),
        new THREE.MeshBasicMaterial({ map: chevTex, transparent: true, depthTest: false, toneMapped: false })
      );
      flow.renderOrder = 6;
      routeGroup.add(flow);

      routeRunner = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xff5a1f, depthTest: false })
      );
      routeRunner.renderOrder = 8;
      routeGroup.add(routeRunner);

      const rStart = makeRing(pts[0], 0xff8a00);
      const rEnd = makeRing(pts[pts.length - 1], 0x1f8f45);
      routeGroup.add(rStart);
      routeGroup.add(rEnd);
      routeRings = [rStart, rEnd];

      scene.add(routeGroup);
      routeStartTime = performance.now();

      if (!fpState.active) {
        const center = new THREE.Box3().setFromPoints(pts).getCenter(new THREE.Vector3());
        const sz = Math.max(24, Math.min(58, L * 0.8));
        flyTo(center, new THREE.Vector3(center.x + sz * 0.9, center.y + sz * 0.75, center.z + sz * 1.1));
      }
    }

    function startFirstPerson(eyeHeight, onUpdate, onFinish) {
      if (!routeCurve) return false;
      fpState.active = true;
      fpState.paused = false;
      fpState.u = 0;
      fpState.eyeHeight = eyeHeight || 1.15;
      fpState.onUpdate = onUpdate;
      fpState.onFinish = onFinish;
      controls.enabled = false;
      flyGoal = null;
      return true;
    }

    function pauseFirstPerson(paused) {
      fpState.paused = paused;
    }

    function seekFirstPerson(u) {
      fpState.u = Math.max(0, Math.min(1, u));
    }

    function stopFirstPerson(station) {
      fpState.active = false;
      fpState.paused = false;
      controls.enabled = true;
      if (station) {
        flyTo(
          new THREE.Vector3(...station.defaultCamera.target),
          new THREE.Vector3(...station.defaultCamera.pos)
        );
      }
    }

    function trainX(t) {
      const c = t % 18;
      if (c < 5) {
        const k = 1 - c / 5;
        return 90 * k * k;
      }
      if (c < 11) return 0;
      if (c < 16) {
        const k = (c - 11) / 5;
        return -90 * k * k;
      }
      return -90;
    }

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const T = clock.elapsedTime;

      if (fpState.active && routeCurve) {
        if (!fpState.paused) {
          const speed = 1 / Math.max(10, routeCurve.getLength() / 4.2);
          fpState.u = Math.min(1, fpState.u + dt * speed);
        }
        const pos = routeCurve.getPointAt(fpState.u);
        const lookAtU = Math.min(1, fpState.u + 0.035);
        const target = routeCurve.getPointAt(lookAtU);

        cam.position.set(pos.x, pos.y + fpState.eyeHeight - 0.7, pos.z);
        cam.lookAt(target.x, target.y + fpState.eyeHeight - 0.85, target.z);

        if (fpState.onUpdate) fpState.onUpdate(fpState.u);
        if (fpState.u >= 1 && !fpState.paused) {
          fpState.paused = true;
          if (fpState.onFinish) fpState.onFinish();
        }
      } else {
        if (flyGoal) {
          controls.target.lerp(flyGoal.t, Math.min(1, dt * 3));
          cam.position.lerp(flyGoal.p, Math.min(1, dt * 3));
        }
        controls.update();
      }

      if (routeCurve && routeRunner) {
        const u = ((performance.now() - routeStartTime) / 1000 / Math.max(6, routeCurve.getLength() / 7)) % 1.2;
        routeRunner.position.copy(routeCurve.getPoint(Math.min(u, 1)));
        chevTex.offset.x -= dt * 1.6;
      }

      routeRings.forEach((r, i) => {
        const s = 1 + 0.25 * Math.sin(T * 4 + i * 2);
        r.scale.set(s, s, 1);
      });

      if (activeFacilityRing) {
        const s = 1 + 0.22 * Math.sin(T * 5);
        activeFacilityRing.scale.set(s, s, 1);
      }

      if (trainGroup) {
        trainGroup.position.x = trainX(T);
      }

      elevatorCabs.forEach((c) => {
        c.mesh.position.y = c.yMin + Math.abs(Math.sin(T * 0.45)) * c.span;
      });

      renderer.render(scene, cam);
    }
    animate();

    return {
      loadStation,
      drawRoute,
      flyTo,
      setTactileHighlight,
      setFloorVisibility,
      highlightFacility,
      startFirstPerson,
      pauseFirstPerson,
      seekFirstPerson,
      stopFirstPerson
    };
  }

  window.Metrogation3D = { createEngine };
})();

/**
 * 메트로게이션(Metrogation) UI 및 상태 제어
 */
(function () {
  const $ = (sel) => document.querySelector(sel);

  const state = {
    stationId: 'ks_pknu',
    profileId: 'wheelchair',
    startId: 'X1',
    endId: 'BN',
    floorVis: {},
    currentRoute: null,
    selectedFacility: null,
    ttsEnabled: false,
    fpActive: false,
    fpPaused: false,
    lastSpokenStep: -1
  };

  const engine = window.Metrogation3D.createEngine($('#canvas-wrap'));

  function getStation() {
    return window.STATION_DATA[state.stationId];
  }

  function speak(text) {
    if (!state.ttsEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ko-KR';
      utter.rate = 1.0;
      window.speechSynthesis.speak(utter);
    } catch (_) {
      // 음성 합성 미지원 환경 무시
    }
  }

  function populateStations() {
    const sel = $('#station-select');
    sel.innerHTML = '';
    Object.values(window.STATION_DATA).forEach((st) => {
      const opt = document.createElement('option');
      opt.value = st.id;
      opt.textContent = `${st.name} (${st.line})`;
      sel.appendChild(opt);
    });
    sel.value = state.stationId;
  }

  function renderProfiles() {
    const wrap = $('#profiles');
    wrap.innerHTML = '';
    Object.values(window.MetrogationRouting.PROFILES).forEach((p) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'profile-btn' + (state.profileId === p.id ? ' on' : '');
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', String(state.profileId === p.id));
      btn.innerHTML = `<span class="p-title">${p.title}</span><span class="p-sub">${p.subtitle}</span>`;
      btn.onclick = () => {
        state.profileId = p.id;
        renderProfiles();
        updateRoute();
        engine.setTactileHighlight(state.profileId === 'visual');
      };
      wrap.appendChild(btn);
    });
  }

  function populateEndpoints(station) {
    const startSel = $('#start-select');
    const endSel = $('#end-select');
    startSel.innerHTML = '';
    endSel.innerHTML = '';

    const groups = [
      {
        label: '출구',
        items: station.exits.map((ex) => ({
          id: ex.id,
          text: `${ex.num}번 출구${ex.hasElevator ? ' (E/V 연계)' : ''}`
        }))
      },
      {
        label: '승강장 방면',
        items: station.track.directions.map((d) => ({
          id: d.id,
          text: d.label
        }))
      },
      {
        label: '교통약자 편의시설',
        items: station.facilities.map((f) => ({
          id: f.nodeId,
          text: `${f.name} (${f.floor})`
        }))
      }
    ];

    [startSel, endSel].forEach((sel) => {
      groups.forEach((grp) => {
        const og = document.createElement('optgroup');
        og.label = grp.label;
        grp.items.forEach((item) => {
          const opt = document.createElement('option');
          opt.value = item.id;
          opt.textContent = item.text;
          og.appendChild(opt);
        });
        sel.appendChild(og);
      });
    });

    startSel.value = state.startId;
    endSel.value = state.endId;
  }

  function renderFacilities(station) {
    const wrap = $('#facilities');
    wrap.innerHTML = '';
    $('#facility-card').classList.add('hidden');
    state.selectedFacility = null;

    station.facilities.forEach((fac) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-chip';
      btn.textContent = fac.icon;
      btn.onclick = () => {
        wrap.querySelectorAll('.btn-chip').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedFacility = fac;
        $('#fc-name').textContent = fac.name;
        $('#fc-floor').textContent = fac.floor;
        $('#fc-desc').textContent = fac.desc;
        $('#facility-card').classList.remove('hidden');
        engine.highlightFacility(fac.id);
        speak(`${fac.name}. ${fac.floor}. ${fac.desc}`);
      };
      wrap.appendChild(btn);
    });
  }

  function renderFloors(station) {
    const wrap = $('#floors');
    wrap.innerHTML = '';
    station.floors.forEach((f) => {
      if (state.floorVis[f.key] === undefined) state.floorVis[f.key] = true;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fl' + (state.floorVis[f.key] ? ' on' : '');
      btn.textContent = f.key;
      btn.onclick = () => {
        state.floorVis[f.key] = !state.floorVis[f.key];
        btn.classList.toggle('on', state.floorVis[f.key]);
        engine.setFloorVisibility(f.key, state.floorVis[f.key]);
      };
      wrap.appendChild(btn);
    });
  }

  function updateRoute() {
    if (state.fpActive) stopFirstPersonUI();
    const station = getStation();
    const res = window.MetrogationRouting.findRoute(station, state.startId, state.endId, state.profileId);
    state.currentRoute = res;

    const sumEl = $('#route-summary');
    const warnEl = $('#route-warning');
    const stepsEl = $('#route-steps');
    stepsEl.innerHTML = '';

    if (!res) {
      sumEl.textContent = '선택한 이동 유형으로 도달할 수 있는 경로를 찾지 못했습니다.';
      warnEl.classList.add('hidden');
      engine.drawRoute(null, state.startId, state.endId);
      return;
    }

    const extra = [];
    if (res.elevatorCount > 0) extra.push(`엘리베이터 ${res.elevatorCount}회`);
    else if (res.stairCount === 0 && res.escalatorCount === 0) extra.push('평지 이동');
    if (state.profileId === 'visual') extra.push(`점자블록 ${res.tactileRatio}%`);

    sumEl.textContent = `약 ${res.totalMeters}m · 예상 ${res.minutes}분${extra.length ? ' (' + extra.join(', ') + ')' : ''}`;

    if (res.warning) {
      warnEl.textContent = '⚠ ' + res.warning;
      warnEl.classList.remove('hidden');
    } else {
      warnEl.classList.add('hidden');
    }

    res.steps.forEach((step, idx) => {
      const li = document.createElement('li');
      li.style.setProperty('--dot-color', step.floorColor);
      li.dataset.idx = String(idx);
      li.innerHTML = `<strong>[${step.floorKey}] ${step.label}</strong>` +
        (step.detail ? `<span class="step-meta">${step.detail}</span>` : '');
      li.onclick = () => {
        stepsEl.querySelectorAll('li').forEach((el) => el.classList.remove('active'));
        li.classList.add('active');
        const p = new THREE.Vector3(step.pos[0], step.pos[1] + 1.0, step.pos[2]);
        engine.flyTo(p, p.clone().add(new THREE.Vector3(11, 10, 13)));
        speak(`${step.floorKey}, ${step.label}. ${step.detail}`);
      };
      stepsEl.appendChild(li);
    });

    engine.drawRoute(res, state.startId, state.endId);
  }

  function stopFirstPersonUI() {
    state.fpActive = false;
    state.fpPaused = false;
    state.lastSpokenStep = -1;
    $('#hud').classList.add('hidden');
    $('#btn-fp-toggle').textContent = '▶ 1인칭 주행 시작';
    $('#btn-fp-pause').classList.add('hidden');
    $('#sim-progress-wrap').classList.add('hidden');
    engine.stopFirstPerson(getStation());
  }

  function syncFirstPersonHUD(u) {
    const pct = Math.round(u * 100);
    $('#sim-slider').value = String(Math.round(u * 1000));
    $('#sim-pct').textContent = pct + '%';

    const res = state.currentRoute;
    if (!res || !res.steps.length) return;
    const idx = Math.min(res.steps.length - 1, Math.floor(u * res.steps.length));
    const step = res.steps[idx];

    $('#hud-floor').textContent = step.floorKey;
    $('#hud-step-title').textContent = step.label;
    $('#hud-step-desc').textContent = step.detail || '경로를 따라 이동 중입니다.';

    const stepEls = document.querySelectorAll('#route-steps li');
    stepEls.forEach((el, i) => el.classList.toggle('active', i === idx));

    if (idx !== state.lastSpokenStep) {
      state.lastSpokenStep = idx;
      speak(`${step.floorKey}, ${step.label}`);
    }
  }

  function selectStation(stationId) {
    state.stationId = stationId;
    const st = getStation();
    state.startId = st.defaultStart;
    state.endId = st.defaultEnd;
    state.floorVis = {};
    st.floors.forEach((f) => { state.floorVis[f.key] = true; });

    $('#station-title').textContent = st.name;
    $('#line-accent').style.background = st.lineColor;
    document.documentElement.style.setProperty('--accent', st.lineColor);

    engine.loadStation(st);
    engine.setTactileHighlight(state.profileId === 'visual');
    populateEndpoints(st);
    renderFacilities(st);
    renderFloors(st);
    updateRoute();
  }

  // 이벤트 바인딩
  $('#station-select').onchange = (e) => selectStation(e.target.value);
  $('#start-select').onchange = (e) => {
    state.startId = e.target.value;
    updateRoute();
  };
  $('#end-select').onchange = (e) => {
    state.endId = e.target.value;
    updateRoute();
  };
  $('#btn-swap').onclick = () => {
    const tmp = state.startId;
    state.startId = state.endId;
    state.endId = tmp;
    $('#start-select').value = state.startId;
    $('#end-select').value = state.endId;
    updateRoute();
  };

  $('#fc-go').onclick = () => {
    if (!state.selectedFacility) return;
    state.endId = state.selectedFacility.nodeId;
    $('#end-select').value = state.endId;
    updateRoute();
  };
  $('#fc-close').onclick = () => {
    $('#facility-card').classList.add('hidden');
    $('#facilities').querySelectorAll('.btn-chip').forEach((b) => b.classList.remove('active'));
  };

  $('#btn-fp-toggle').onclick = () => {
    if (state.fpActive) {
      stopFirstPersonUI();
      return;
    }
    const profile = window.MetrogationRouting.PROFILES[state.profileId];
    const ok = engine.startFirstPerson(
      profile.eyeHeight,
      syncFirstPersonHUD,
      () => {
        state.fpPaused = true;
        $('#btn-fp-pause').textContent = '다시 재생';
        speak('목적지에 도착했습니다.');
      }
    );
    if (!ok) return;
    state.fpActive = true;
    state.fpPaused = false;
    state.lastSpokenStep = -1;
    $('#hud').classList.remove('hidden');
    $('#btn-fp-toggle').textContent = '■ 주행 종료';
    $('#btn-fp-pause').classList.remove('hidden');
    $('#btn-fp-pause').textContent = '일시정지';
    $('#sim-progress-wrap').classList.remove('hidden');
  };

  $('#btn-fp-pause').onclick = () => {
    if (!state.fpActive) return;
    if (Number($('#sim-slider').value) >= 999) {
      engine.seekFirstPerson(0);
    }
    state.fpPaused = !state.fpPaused;
    engine.pauseFirstPerson(state.fpPaused);
    $('#btn-fp-pause').textContent = state.fpPaused ? '계속 주행' : '일시정지';
  };

  $('#sim-slider').oninput = (e) => {
    const u = Number(e.target.value) / 1000;
    engine.seekFirstPerson(u);
    syncFirstPersonHUD(u);
  };

  $('#hud-exit-fp').onclick = stopFirstPersonUI;

  $('#btn-reset-cam').onclick = () => {
    if (state.fpActive) stopFirstPersonUI();
    const st = getStation();
    engine.flyTo(
      new THREE.Vector3(...st.defaultCamera.target),
      new THREE.Vector3(...st.defaultCamera.pos)
    );
  };

  // 접근성 토글
  $('#btn-large-text').onclick = (e) => {
    const on = document.body.classList.toggle('large-text');
    e.currentTarget.setAttribute('aria-pressed', String(on));
  };

  $('#btn-high-contrast').onclick = (e) => {
    const on = document.body.classList.toggle('high-contrast');
    e.currentTarget.setAttribute('aria-pressed', String(on));
  };

  $('#btn-tts').onclick = (e) => {
    state.ttsEnabled = !state.ttsEnabled;
    e.currentTarget.setAttribute('aria-pressed', String(state.ttsEnabled));
    if (state.ttsEnabled) speak('음성 안내를 켰습니다.');
    else if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  // 역무원 도움 요청 모달
  $('#btn-help-call').onclick = () => {
    const st = getStation();
    $('#help-modal-body').textContent = `${st.name} (${st.line}) 역무원 연락처: ${st.officePhone}`;
    $('#help-office-loc').textContent = st.officeLocationText;
    $('#help-modal').classList.remove('hidden');
  };
  $('#help-close').onclick = () => $('#help-modal').classList.add('hidden');
  $('#help-fly-office').onclick = () => {
    const st = getStation();
    $('#help-modal').classList.add('hidden');
    const officeFac = st.facilities.find((f) => f.id === 'FAC_OFFICE');
    if (officeFac) {
      engine.highlightFacility(officeFac.id);
      state.endId = officeFac.nodeId;
      $('#end-select').value = state.endId;
      updateRoute();
    }
  };

  // 모바일 패널 접기/펼치기
  $('#mobile-toggle').onclick = () => {
    const panel = $('#panel');
    const collapsed = panel.classList.toggle('collapsed');
    $('#mobile-toggle').textContent = collapsed ? '안내 패널 펼치기 ▴' : '안내 패널 접기 ▾';
    $('#mobile-toggle').setAttribute('aria-expanded', String(!collapsed));
  };

  // 초기화
  populateStations();
  renderProfiles();
  selectStation(state.stationId);
})();

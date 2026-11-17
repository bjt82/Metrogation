/**
 * 메트로게이션(Metrogation) 역 데이터 레지스트리
 * 새로운 역을 추가하려면 window.STATION_DATA[stationId] 객체를 추가하면 됩니다.
 */
(function () {
  window.STATION_DATA = {
    ks_pknu: {
      id: 'ks_pknu',
      name: '경성대·부경대역',
      line: '부산 2호선',
      lineColor: '#1f8f45',
      lineColorHex: 0x2fa44f,
      officePhone: '051-623-2104 (역무실 안내)',
      officeLocationText: 'B1 대합실 동측 개찰구 인근',
      defaultStart: 'X1',
      defaultEnd: 'BN',
      defaultCamera: { target: [0, 6, 0], pos: [46, 36, 50] },
      floors: [
        { key: 'B1', label: 'B1 대합실', y: 12, color: '#e29a10' },
        { key: 'B2', label: 'B2 환승통로', y: 6, color: '#8a63d6' },
        { key: 'B3', label: 'B3 승강장', y: 0, color: '#1f8f9f' }
      ],
      slabs: [
        { floor: 'B1', w: 52, d: 12, y: 12, z: 0, colors: ['#c7c8c6', '#8d9094'] },
        { floor: 'B2', w: 36, d: 12, y: 6, z: 0, colors: ['#bdbfc0', '#868a8e'] },
        { floor: 'B3', w: 52, d: 4.5, y: 0, z: 3.75, colors: ['#b4b8bb', '#7f8488'] },
        { floor: 'B3', w: 52, d: 4.5, y: 0, z: -3.75, colors: ['#b4b8bb', '#7f8488'] }
      ],
      pillars: [
        [-17, -5.6], [-17, 5.6], [0, -5.6], [0, 5.6], [17, -5.6], [17, 5.6]
      ],
      track: {
        length: 52,
        trainColorHex: 0x2fa44f,
        directions: [
          { id: 'BN', label: '남천역 방면 승강장', x: -24, z: 3.5 },
          { id: 'BD', label: '대연역 방면 승강장', x: 24, z: 3.5 }
        ]
      },
      stairs: [
        { floor: 'B2', x0: -16, y0: 12, x1: -6, y1: 6, z: -2, w: 1.8, type: 'stair' },
        { floor: 'B2', x0: -6, y0: 6, x1: -16, y1: 0, z: 2, w: 1.8, type: 'stair' },
        { floor: 'B2', x0: 16, y0: 12, x1: 6, y1: 6, z: -2, w: 1.8, type: 'stair' },
        { floor: 'B2', x0: 6, y0: 6, x1: 16, y1: 0, z: 2, w: 1.8, type: 'stair' },
        { floor: 'B2', x0: -16, y0: 12, x1: -6, y1: 6, z: -4.2, w: 1.2, type: 'escalator' },
        { floor: 'B2', x0: -6, y0: 6, x1: -16, y1: 0, z: 4.2, w: 1.2, type: 'escalator' },
        { floor: 'B2', x0: 16, y0: 12, x1: 6, y1: 6, z: -4.2, w: 1.2, type: 'escalator' },
        { floor: 'B2', x0: 6, y0: 6, x1: 16, y1: 0, z: 4.2, w: 1.2, type: 'escalator' }
      ],
      elevators: [
        { id: 'EL1', label: '중앙 엘리베이터', x: 0, z: 4, yMin: 0, yMax: 12 }
      ],
      gates: {
        x: -3.5, y: 12, count: 5, wideIndex: 2
      },
      exits: [
        { id: 'X1', num: '1', x: -24, z: -4, hasElevator: false },
        { id: 'X2', num: '2', x: -24, z: 4, hasElevator: false },
        { id: 'X3', num: '3', x: -4, z: -5, hasElevator: false },
        { id: 'X4', num: '4', x: 4, z: -5, hasElevator: true },
        { id: 'X5', num: '5', x: 24, z: -4, hasElevator: false },
        { id: 'X6', num: '6', x: 24, z: 4, hasElevator: false }
      ],
      tactileZones: [
        { floor: 'B3', x: 0, y: 0.025, z: -1.95, w: 52, d: 0.6 },
        { floor: 'B3', x: 0, y: 0.025, z: 1.95, w: 52, d: 0.6 },
        { floor: 'B1', x: -12, y: 12.03, z: 0, w: 26, d: 0.5 },
        { floor: 'B1', x: 0, y: 12.03, z: 2, w: 0.5, d: 4 }
      ],
      facilities: [
        {
          id: 'FAC_RESTROOM',
          nodeId: 'FR',
          icon: '♿ 화장실',
          name: '장애인 화장실',
          floor: 'B1',
          pos: [-9, 12, 4],
          color: '#0284c7',
          desc: 'B1 대합실 서쪽. 자동문, 비상 호출벨 및 유아용 거치대 구비.'
        },
        {
          id: 'FAC_CHARGER',
          nodeId: 'FC',
          icon: '🔋 휠체어 충전기',
          name: '전동휠체어 급속충전기',
          floor: 'B1',
          pos: [-1.2, 12, 3.8],
          color: '#16a34a',
          desc: 'B1 개찰구 안쪽, 중앙 엘리베이터 바로 옆 (2대 동시 충전).'
        },
        {
          id: 'FAC_NURSING',
          nodeId: 'FN',
          icon: '🍼 수유실',
          name: '유아휴게실 · 수유실',
          floor: 'B1',
          pos: [9, 12, -3.6],
          color: '#db2777',
          desc: 'B1 역무실 옆. 기저귀 교환대 및 온수기 이용 가능.'
        },
        {
          id: 'FAC_BRAILLE',
          nodeId: 'FB',
          icon: '⠿ 점자안내도',
          name: '음성·점자 종합안내도',
          floor: 'B1',
          pos: [-5.5, 12, -2.5],
          color: '#ca8a04',
          desc: 'B1 개찰구 앞. 촉지 안내판 및 음성 안내 버튼 제공.'
        },
        {
          id: 'FAC_OFFICE',
          nodeId: 'FO',
          icon: '🛟 역무실',
          name: '역무실 · 이동도움 접수',
          floor: 'B1',
          pos: [6, 12, -3.6],
          color: '#dc2626',
          desc: '휠체어 리프트, 안전발판, 시각장애인 안내 동행 요청 가능.'
        }
      ],
      // 경로 탐색용 그래프 노드: [x, y, z, 라벨, 부가설명]
      nodes: {
        X1: [-24, 12, -4, '1번 출구', '지상 연결 통로 진입'],
        X2: [-24, 12, 4, '2번 출구', '지상 연결 통로 진입'],
        X3: [-4, 12, -5, '3번 출구', '대합실 북측 진입'],
        X4: [4, 12, -5, '4번 출구 (외부 E/V)', '지상 엘리베이터 연계 출구'],
        X5: [24, 12, -4, '5번 출구', '동측 대합실 진입'],
        X6: [24, 12, 4, '6번 출구', '동측 대합실 진입'],
        W1: [-16, 12, -2, '서쪽 계단·에스컬레이터 입구', 'B2 환승층 하행'],
        CM_OUT: [-5.5, 12, 0, '개찰구 앞 (점자블록 분기)', '교통약자용 넓은 개찰구 직전'],
        WG: [-3.5, 12, 0, '교통약자용 넓은 개찰구 통과', '폭 1.1m 이상 자동 게이트 (단차 없음)'],
        CM: [-1.5, 12, 0, '개찰구 안쪽 대합실', '중앙 엘리베이터·역무실 방면'],
        E1: [16, 12, -2, '동쪽 계단·에스컬레이터 입구', 'B2 환승층 하행'],
        W2a: [-6, 6, -2, 'B2 서쪽 중간층', '환승 연결 통로'],
        W2b: [-6, 6, 2, 'B2 서쪽 승강장 하행 입구', '승강장 방향'],
        W3: [-16, 0, 3, 'B3 서쪽 승강장 도착', '남천역 방면'],
        E2a: [6, 6, -2, 'B2 동쪽 중간층', '환승 연결 통로'],
        E2b: [6, 6, 2, 'B2 동쪽 승강장 하행 입구', '승강장 방향'],
        E3: [16, 0, 3, 'B3 동쪽 승강장 도착', '대연역 방면'],
        L1: [0, 12, 4, 'B1 중앙 엘리베이터 탑승', 'B1 → B3 직통 승강기'],
        L2: [0, 6, 4, 'B2 중앙 엘리베이터 경유', '환승층 통과'],
        L3: [0, 0, 4, 'B3 승강장 엘리베이터 하차', '스크린도어·점자블록 연결'],
        PM: [0, 0, 3, 'B3 승강장 중앙', '교통약자 우선 탑승 구역 인근'],
        BN: [-22, 0, 3, '남천역 방면 승차 위치', '스크린도어 앞 정차 위치'],
        BD: [22, 0, 3, '대연역 방면 승차 위치', '스크린도어 앞 정차 위치'],
        FR: [-9, 12, 4, '장애인 화장실 도착', '자동문 및 비상벨 구비'],
        FC: [-1.2, 12, 3.8, '전동휠체어 급속충전기 도착', '무료 급속 충전 가능'],
        FN: [9, 12, -3.6, '수유실 도착', '역무실 우측'],
        FB: [-5.5, 12, -2.5, '음성·점자 안내도 도착', '촉지판 및 음성 안내 버튼'],
        FO: [6, 12, -3.6, '역무실 도착', '역무원 이동 도움 요청 가능']
      },
      // 엣지: [a, b, type, tactile]
      // type: 'w'(평지), 'st'(계단), 'es'(에스컬레이터), 'el'(엘리베이터), 'wg'(넓은개찰구)
      edges: [
        ['X1', 'W1', 'w', true],
        ['X2', 'W1', 'w', true],
        ['W1', 'CM_OUT', 'w', true],
        ['X3', 'CM_OUT', 'w', true],
        ['X4', 'FO', 'w', true],
        ['X4', 'CM_OUT', 'w', true],
        ['X5', 'E1', 'w', false],
        ['X6', 'E1', 'w', false],
        ['E1', 'FO', 'w', false],
        ['FO', 'CM', 'w', true],
        ['FO', 'FN', 'w', false],
        ['CM_OUT', 'FB', 'w', true],
        ['CM_OUT', 'FR', 'w', true],
        ['CM_OUT', 'WG', 'wg', true],
        ['WG', 'CM', 'w', true],
        ['CM', 'FC', 'w', true],
        ['CM', 'L1', 'w', true],
        ['FC', 'L1', 'w', true],
        ['W1', 'W2a', 'st', false],
        ['W2a', 'W2b', 'w', false],
        ['W2b', 'W3', 'st', false],
        ['E1', 'E2a', 'es', false],
        ['E2a', 'E2b', 'w', false],
        ['E2b', 'E3', 'es', false],
        ['L1', 'L2', 'el', true],
        ['L2', 'L3', 'el', true],
        ['L3', 'PM', 'w', true],
        ['W3', 'PM', 'w', true],
        ['PM', 'E3', 'w', true],
        ['W3', 'BN', 'w', true],
        ['E3', 'BD', 'w', true]
      ]
    },

    seomyeon_sample: {
      id: 'seomyeon_sample',
      name: '서면역 (환승 샘플)',
      line: '부산 1·2호선 환승',
      lineColor: '#d97706',
      lineColorHex: 0xd97706,
      officePhone: '051-808-2114 (환승역무실 안내)',
      officeLocationText: 'B1 중앙 환승 대합실',
      defaultStart: 'X1',
      defaultEnd: 'BN',
      defaultCamera: { target: [0, 6, 0], pos: [48, 38, 52] },
      floors: [
        { key: 'B1', label: 'B1 통합 대합실', y: 12, color: '#e29a10' },
        { key: 'B2', label: 'B2 1호선 승강장', y: 6, color: '#ea580c' },
        { key: 'B3', label: 'B3 2호선 승강장', y: 0, color: '#1f8f45' }
      ],
      slabs: [
        { floor: 'B1', w: 50, d: 14, y: 12, z: 0, colors: ['#cbc8c2', '#8e8b86'] },
        { floor: 'B2', w: 46, d: 10, y: 6, z: 0, colors: ['#c2bfba', '#85827d'] },
        { floor: 'B3', w: 52, d: 4.5, y: 0, z: 3.75, colors: ['#b4b8bb', '#7f8488'] },
        { floor: 'B3', w: 52, d: 4.5, y: 0, z: -3.75, colors: ['#b4b8bb', '#7f8488'] }
      ],
      pillars: [
        [-18, -5.8], [-18, 5.8], [0, -5.8], [0, 5.8], [18, -5.8], [18, 5.8]
      ],
      track: {
        length: 52,
        trainColorHex: 0xd97706,
        directions: [
          { id: 'BN', label: '1호선 노포·신평 방면 (B2)', x: -20, z: 3.2 },
          { id: 'BD', label: '2호선 장산·양산 방면 (B3)', x: 22, z: 3.5 }
        ]
      },
      stairs: [
        { floor: 'B2', x0: -14, y0: 12, x1: -6, y1: 6, z: -2.5, w: 1.8, type: 'stair' },
        { floor: 'B2', x0: 14, y0: 6, x1: 6, y1: 0, z: 2.5, w: 1.8, type: 'escalator' }
      ],
      elevators: [
        { id: 'EL1', label: '중앙 환승 엘리베이터', x: 0, z: 4.2, yMin: 0, yMax: 12 }
      ],
      gates: {
        x: -6, y: 12, count: 5, wideIndex: 2
      },
      exits: [
        { id: 'X1', num: '1', x: -22, z: -4, hasElevator: true },
        { id: 'X2', num: '2', x: -22, z: 4, hasElevator: false },
        { id: 'X7', num: '7', x: 22, z: -4, hasElevator: true },
        { id: 'X9', num: '9', x: 22, z: 4, hasElevator: false }
      ],
      tactileZones: [
        { floor: 'B3', x: 0, y: 0.025, z: 1.95, w: 52, d: 0.6 },
        { floor: 'B2', x: 0, y: 6.025, z: 2.2, w: 44, d: 0.6 },
        { floor: 'B1', x: -8, y: 12.03, z: 0, w: 28, d: 0.5 }
      ],
      facilities: [
        {
          id: 'FAC_RESTROOM',
          nodeId: 'FR',
          icon: '♿ 화장실',
          name: '장애인 화장실',
          floor: 'B1',
          pos: [-11, 12, 4.5],
          color: '#0284c7',
          desc: 'B1 서측 개찰구 외곽. 전동휠체어 회전 반경 확보.'
        },
        {
          id: 'FAC_CHARGER',
          nodeId: 'FC',
          icon: '🔋 휠체어 충전기',
          name: '전동휠체어 급속충전기',
          floor: 'B1',
          pos: [2, 12, 4.2],
          color: '#16a34a',
          desc: '중앙 환승 엘리베이터 앞 대기 공간.'
        },
        {
          id: 'FAC_OFFICE',
          nodeId: 'FO',
          icon: '🛟 역무실',
          name: '환승 역무실',
          floor: 'B1',
          pos: [8, 12, -3.5],
          color: '#dc2626',
          desc: '1·2호선 환승 이동 도우미 상주.'
        }
      ],
      nodes: {
        X1: [-22, 12, -4, '1번 출구 (외부 E/V)', '지상 엘리베이터 연결'],
        X2: [-22, 12, 4, '2번 출구', '서면지하상가 방면'],
        X7: [22, 12, -4, '7번 출구 (외부 E/V)', '지상 엘리베이터 연결'],
        X9: [22, 12, 4, '9번 출구', '동측 진입'],
        W1: [-14, 12, -2.5, 'B1 서쪽 계단 입구', '1호선 하행'],
        WG: [-6, 12, 0, '교통약자용 넓은 개찰구 통과', '배리어프리 게이트'],
        CM: [0, 12, 0, 'B1 중앙 환승 대합실', '엘리베이터·역무실 연결'],
        L1: [0, 12, 4.2, 'B1 중앙 환승 엘리베이터 탑승', 'B1 ↔ B2 ↔ B3'],
        L2: [0, 6, 4.2, 'B2 1호선 승강장 도착/경유', '1호선 환승 가능'],
        L3: [0, 0, 4.2, 'B3 2호선 승강장 하차', '2호선 스크린도어 연결'],
        W2: [-6, 6, -2.5, 'B2 1호선 승강장 진입', '계단 하차'],
        BN: [-20, 6, 3.2, '1호선 노포·신평 방면 승차 위치', 'B2 승강장'],
        E2: [14, 6, 2.5, 'B2 동쪽 에스컬레이터 입구', '2호선 하행'],
        E3: [6, 0, 2.5, 'B3 2호선 승강장 진입', '에스컬레이터 하차'],
        BD: [22, 0, 3.5, '2호선 장산·양산 방면 승차 위치', 'B3 승강장'],
        FR: [-11, 12, 4.5, '장애인 화장실 도착', '자동문 구비'],
        FC: [2, 12, 4.2, '전동휠체어 급속충전기 도착', '급속 충전 가능'],
        FO: [8, 12, -3.5, '환승 역무실 도착', '이동 도우미 호출 가능']
      },
      edges: [
        ['X1', 'W1', 'w', true],
        ['X2', 'W1', 'w', true],
        ['W1', 'WG', 'w', true],
        ['WG', 'FR', 'w', true],
        ['WG', 'CM', 'w', true],
        ['X7', 'FO', 'w', true],
        ['X9', 'FO', 'w', false],
        ['FO', 'CM', 'w', true],
        ['CM', 'FC', 'w', true],
        ['CM', 'L1', 'w', true],
        ['FC', 'L1', 'w', true],
        ['L1', 'L2', 'el', true],
        ['L2', 'L3', 'el', true],
        ['W1', 'W2', 'st', false],
        ['W2', 'L2', 'w', true],
        ['L2', 'BN', 'w', true],
        ['L2', 'E2', 'w', false],
        ['E2', 'E3', 'es', false],
        ['E3', 'L3', 'w', true],
        ['L3', 'BD', 'w', true]
      ]
    }
  };
})();

/**
 * 메트로게이션(Metrogation) 역 데이터 레지스트리
 * 부산교통공사 안내 정보 기반 경성대·부경대역(2호선) 및 서면역(1·2호선 환승) 구조 반영
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
      officePhone: '1544-5005 (부산교통공사 고객센터 / B1 역무실)',
      officeLocationText: 'B1 대합실 개찰구 인근 역무실',
      defaultStart: 'X3',
      defaultEnd: 'BN',
      defaultCamera: { target: [0, 6, 0], pos: [46, 36, 50] },
      floors: [
        { key: 'B1', label: 'B1 대합실·개찰구', y: 12, color: '#e29a10' },
        { key: 'B2', label: 'B2 중간 연결층', y: 6, color: '#8a63d6' },
        { key: 'B3', label: 'B3 상대식 승강장', y: 0, color: '#1f8f9f' }
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
          { id: 'BN', label: '장산 방면 (남천역 다음 · B3)', x: -24, z: 3.5 },
          { id: 'BD', label: '양산 방면 (대연역 다음 · B3)', x: 24, z: -3.5 }
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
        { id: 'EL1', label: '대합실↔승강장 E/V (남천 방면)', x: 0, z: 4, yMin: 0, yMax: 12 },
        { id: 'EL2', label: '대합실↔승강장 E/V (대연 방면)', x: 0, z: -4, yMin: 0, yMax: 12 }
      ],
      gates: {
        x: -3.5, y: 12, count: 5, wideIndex: 2
      },
      exits: [
        { id: 'X1', num: '1', x: -24, z: -4, hasElevator: false },
        { id: 'X2', num: '2', x: -24, z: 4, hasElevator: false },
        { id: 'X3', num: '3', x: -5, z: -5, hasElevator: true },
        { id: 'X4', num: '4', x: 4, z: -5, hasElevator: false },
        { id: 'X5', num: '5', x: 24, z: -4, hasElevator: false },
        { id: 'X6', num: '6', x: 24, z: 4, hasElevator: false }
      ],
      tactileZones: [
        { floor: 'B3', x: 0, y: 0.025, z: -1.95, w: 52, d: 0.6 },
        { floor: 'B3', x: 0, y: 0.025, z: 1.95, w: 52, d: 0.6 },
        { floor: 'B1', x: -12, y: 12.03, z: 0, w: 26, d: 0.5 },
        { floor: 'B1', x: 0, y: 12.03, z: 0, w: 0.5, d: 8 }
      ],
      facilities: [
        {
          id: 'FAC_RESTROOM',
          nodeId: 'FR',
          icon: '♿ 화장실',
          name: '장애인 화장실 (개찰구 밖)',
          floor: 'B1',
          pos: [8, 12, -4.5],
          color: '#0284c7',
          desc: 'B1 대합실 개찰구 밖 (3번·5번 출구 사이). 교통카드 태그 없이 이용 가능.'
        },
        {
          id: 'FAC_CHARGER',
          nodeId: 'FC',
          icon: '🔋 휠체어 충전기',
          name: '전동휠체어 급속충전기',
          floor: 'B1',
          pos: [-1.2, 12, 3.8],
          color: '#16a34a',
          desc: 'B1 대합실 고객센터(역무실) 인근 설치.'
        },
        {
          id: 'FAC_NURSING',
          nodeId: 'FN',
          icon: '🍼 수유실',
          name: '모유수유실 (역무실 내)',
          floor: 'B1',
          pos: [8.5, 12, -2.0],
          color: '#db2777',
          desc: 'B1 역무실 내 안쪽에 위치. 역무실에 문의하여 안내받아 이용.'
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
          name: '역무실 · 고객센터',
          floor: 'B1',
          pos: [6, 12, -2.0],
          color: '#dc2626',
          desc: 'B1 대합실. 휠체어 리프트, 안전발판, 수유실 안내 및 이동 동행 요청 가능.'
        }
      ],
      nodes: {
        X1: [-24, 12, -4, '1번 출구', '지상 연결 통로 진입'],
        X2: [-24, 12, 4, '2번 출구', '지상 연결 통로 진입'],
        X3: [-5, 12, -5, '3번 출구 (외부 E/V)', '지상↔B1 대합실 외부 엘리베이터 연계'],
        X4: [4, 12, -5, '4번 출구', '대합실 북측 진입'],
        X5: [24, 12, -4, '5번 출구', '동측 대합실 진입'],
        X6: [24, 12, 4, '6번 출구', '동측 대합실 진입'],
        W1: [-16, 12, -2, '서쪽 계단·에스컬레이터 입구', 'B2 중간층 하행'],
        CM_OUT: [-5.5, 12, 0, '개찰구 앞 (점자블록 분기)', '교통약자용 넓은 개찰구 직전'],
        WG: [-3.5, 12, 0, '교통약자용 넓은 개찰구 통과', '폭 1.1m 이상 자동 게이트 (단차 없음)'],
        CM: [-1.5, 12, 0, '개찰구 안쪽 대합실', '승강장 엘리베이터 분기 (남천/대연 방면 선택)'],
        E1: [16, 12, -2, '동쪽 계단·에스컬레이터 입구', 'B2 중간층 하행'],
        W2a: [-6, 6, -2, 'B2 서쪽 중간층', '연결 통로'],
        W2b: [-6, 6, 2, 'B2 서쪽 승강장 하행 입구', '승강장 방향'],
        W3: [-16, 0, 3, 'B3 장산 방면 승강장 도착', '남천역 다음'],
        E2a: [6, 6, -2, 'B2 동쪽 중간층', '연결 통로'],
        E2b: [6, 6, 2, 'B2 동쪽 승강장 하행 입구', '승강장 방향'],
        E3: [16, 0, -3, 'B3 양산 방면 승강장 도착', '대연역 다음'],
        L1S: [0, 12, 4, 'B1 엘리베이터 탑승 (장산/남천 방면)', 'B1 → B3 상대식 승강장 직통'],
        L2S: [0, 6, 4, 'B2 엘리베이터 경유', '중간층 통과'],
        L3S: [0, 0, 4, 'B3 장산 방면 승강장 E/V 하차', '스크린도어·점자블록 연결'],
        L1N: [0, 12, -4, 'B1 엘리베이터 탑승 (양산/대연 방면)', 'B1 → B3 상대식 승강장 직통'],
        L2N: [0, 6, -4, 'B2 엘리베이터 경유', '중간층 통과'],
        L3N: [0, 0, -4, 'B3 양산 방면 승강장 E/V 하차', '스크린도어·점자블록 연결'],
        PM_S: [0, 0, 3.2, 'B3 장산 방면 승강장 중앙', '교통약자 우선 탑승 구역'],
        PM_N: [0, 0, -3.2, 'B3 양산 방면 승강장 중앙', '교통약자 우선 탑승 구역'],
        BN: [-22, 0, 3.5, '장산 방면 승차 위치 (남천역 다음)', '상대식 승강장 스크린도어 앞'],
        BD: [22, 0, -3.5, '양산 방면 승차 위치 (대연역 다음)', '상대식 승강장 스크린도어 앞'],
        FR: [8, 12, -4.5, '장애인 화장실 도착 (개찰구 밖)', '3번·5번 출구 사이 위치'],
        FC: [-1.2, 12, 3.8, '전동휠체어 급속충전기 도착', 'B1 대합실 고객센터 인근'],
        FN: [8.5, 12, -2.0, '모유수유실 도착 (역무실 내)', '역무실 안내 후 이용'],
        FB: [-5.5, 12, -2.5, '음성·점자 안내도 도착', '촉지판 및 음성 안내 버튼'],
        FO: [6, 12, -2.0, '역무실·고객센터 도착', '이동 도움 및 수유실 안내 요청']
      },
      edges: [
        ['X1', 'W1', 'w', true],
        ['X2', 'W1', 'w', true],
        ['W1', 'CM_OUT', 'w', true],
        ['X3', 'CM_OUT', 'w', true],
        ['X3', 'FR', 'w', true],
        ['X4', 'CM_OUT', 'w', true],
        ['X4', 'FR', 'w', true],
        ['X5', 'FR', 'w', false],
        ['X5', 'E1', 'w', false],
        ['X6', 'E1', 'w', false],
        ['E1', 'FR', 'w', false],
        ['CM_OUT', 'FB', 'w', true],
        ['CM_OUT', 'WG', 'wg', true],
        ['WG', 'CM', 'w', true],
        ['CM', 'FO', 'w', true],
        ['FO', 'FN', 'w', true],
        ['CM', 'FC', 'w', true],
        ['CM', 'L1S', 'w', true],
        ['CM', 'L1N', 'w', true],
        ['FC', 'L1S', 'w', true],
        ['W1', 'W2a', 'st', false],
        ['W2a', 'W2b', 'w', false],
        ['W2b', 'W3', 'st', false],
        ['E1', 'E2a', 'es', false],
        ['E2a', 'E2b', 'w', false],
        ['E2b', 'E3', 'es', false],
        ['L1S', 'L2S', 'el', true],
        ['L2S', 'L3S', 'el', true],
        ['L3S', 'PM_S', 'w', true],
        ['W3', 'PM_S', 'w', true],
        ['PM_S', 'BN', 'w', true],
        ['L1N', 'L2N', 'el', true],
        ['L2N', 'L3N', 'el', true],
        ['L3N', 'PM_N', 'w', true],
        ['E3', 'PM_N', 'w', true],
        ['PM_N', 'BD', 'w', true]
      ]
    },

    seomyeon: {
      id: 'seomyeon',
      name: '서면역',
      line: '부산 1·2호선 환승',
      lineColor: '#d97706',
      lineColorHex: 0xd97706,
      officePhone: '1544-5005 (부산교통공사 / B1 역무안전실)',
      officeLocationText: 'B1 통합 대합실 1호선측 역무안전실',
      defaultStart: 'X13',
      defaultEnd: 'BN',
      defaultCamera: { target: [0, 6, 0], pos: [50, 38, 54] },
      floors: [
        { key: 'B1', label: 'B1 통합 대합실·개찰구', y: 12, color: '#e29a10' },
        { key: 'B2', label: 'B2 1호선 상대식 승강장', y: 6, color: '#ea580c' },
        { key: 'B3', label: 'B3 2호선 섬식 승강장', y: 0, color: '#1f8f45' }
      ],
      slabs: [
        { floor: 'B1', w: 54, d: 14, y: 12, z: 0, colors: ['#cbc8c2', '#8e8b86'] },
        { floor: 'B2', w: 48, d: 4.5, y: 6, z: 3.75, colors: ['#c2bfba', '#85827d'] },
        { floor: 'B2', w: 48, d: 4.5, y: 6, z: -3.75, colors: ['#c2bfba', '#85827d'] },
        { floor: 'B3', w: 52, d: 4.5, y: 0, z: 3.75, colors: ['#b4b8bb', '#7f8488'] },
        { floor: 'B3', w: 52, d: 4.5, y: 0, z: -3.75, colors: ['#b4b8bb', '#7f8488'] }
      ],
      pillars: [
        [-19, -5.8], [-19, 5.8], [0, -5.8], [0, 5.8], [19, -5.8], [19, 5.8]
      ],
      track: {
        length: 52,
        trainColorHex: 0xd97706,
        directions: [
          { id: 'BN', label: '1호선 노포 방면 (B2 상대식)', x: -20, z: 3.5 },
          { id: 'BN_S', label: '1호선 다대포해수욕장 방면 (B2 상대식)', x: 20, z: -3.5 },
          { id: 'BD', label: '2호선 장산·양산 방면 (B3 섬식)', x: 22, z: 3.5 }
        ]
      },
      stairs: [
        { floor: 'B2', x0: -14, y0: 12, x1: -6, y1: 6, z: 2.5, w: 1.8, type: 'stair' },
        { floor: 'B2', x0: 14, y0: 6, x1: 6, y1: 0, z: 2.5, w: 1.8, type: 'escalator' }
      ],
      elevators: [
        { id: 'EL1', label: '1호선 노포방면·환승 E/V', x: 0, z: 4.2, yMin: 0, yMax: 12 },
        { id: 'EL2', label: '1호선 다대포방면 E/V', x: 0, z: -4.2, yMin: 6, yMax: 12 }
      ],
      gates: {
        x: -7, y: 12, count: 5, wideIndex: 2
      },
      exits: [
        { id: 'X13', num: '13', x: -22, z: -4.5, hasElevator: true },
        { id: 'X12', num: '12', x: -22, z: 4.5, hasElevator: true },
        { id: 'X15', num: '15', x: -12, z: 5.5, hasElevator: false },
        { id: 'X5', num: '5', x: 22, z: -4.5, hasElevator: false },
        { id: 'X7', num: '7', x: 22, z: 4.5, hasElevator: false }
      ],
      tactileZones: [
        { floor: 'B3', x: 0, y: 0.025, z: 1.95, w: 52, d: 0.6 },
        { floor: 'B2', x: 0, y: 6.025, z: 2.0, w: 46, d: 0.6 },
        { floor: 'B2', x: 0, y: 6.025, z: -2.0, w: 46, d: 0.6 },
        { floor: 'B1', x: -8, y: 12.03, z: 0, w: 30, d: 0.5 }
      ],
      facilities: [
        {
          id: 'FAC_RESTROOM_1',
          nodeId: 'FR1',
          icon: '♿ 화장실(1호선)',
          name: '장애인 화장실 (1호선측)',
          floor: 'B1',
          pos: [-16, 12, -4.5],
          color: '#0284c7',
          desc: 'B1 개찰구 밖 13번 출구·역무실 후문 인근. 교통카드 태그 없이 이용 가능.'
        },
        {
          id: 'FAC_RESTROOM_2',
          nodeId: 'FR2',
          icon: '♿ 화장실(2호선)',
          name: '장애인 화장실 (2호선측)',
          floor: 'B1',
          pos: [16, 12, -4.5],
          color: '#0369a1',
          desc: 'B1 개찰구 밖 5번 출구 방향(아이온시티 옆 인근).'
        },
        {
          id: 'FAC_CHARGER',
          nodeId: 'FC',
          icon: '🔋 휠체어 충전기',
          name: '전동휠체어 급속충전기',
          floor: 'B1',
          pos: [-12, 12, 3.8],
          color: '#16a34a',
          desc: 'B1 대합실 1호선 15번 출구 방향(분리수거실 맞은편 벽면).'
        },
        {
          id: 'FAC_NURSING',
          nodeId: 'FN',
          icon: '🍼 수유실',
          name: '모유수유실 (1호선측)',
          floor: 'B1',
          pos: [8, 12, -2.5],
          color: '#db2777',
          desc: '1호선 서면역 전용 수유실. 역무안전실 안내로 이용 가능.'
        },
        {
          id: 'FAC_OFFICE',
          nodeId: 'FO',
          icon: '🛟 역무안전실',
          name: '역무안전실 · 환승 도움',
          floor: 'B1',
          pos: [5, 12, -2.5],
          color: '#dc2626',
          desc: '1·2호선 환승 이동 보조 및 수유실·휠체어 리프트 안내.'
        }
      ],
      nodes: {
        X13: [-22, 12, -4.5, '13번 출구 (외부 E/V)', '1호선측 지상 엘리베이터 연계'],
        X12: [-22, 12, 4.5, '12번 출구 (외부 E/V)', '지상 엘리베이터 연계'],
        X15: [-12, 12, 5.5, '15번 출구', '전동휠체어 충전기 인근'],
        X5: [22, 12, -4.5, '5번 출구', '2호선측 장애인 화장실 인근'],
        X7: [22, 12, 4.5, '7번 출구', '서면교차로 방면'],
        W1: [-14, 12, 2.5, 'B1 1호선 하행 계단 입구', 'B2 1호선 승강장 방면'],
        WG: [-7, 12, 0, '교통약자용 넓은 개찰구 통과', '배리어프리 게이트 (단차 없음)'],
        CM: [0, 12, 0, 'B1 중앙 환승 대합실', '1·2호선 엘리베이터 및 역무실 연결'],
        L1A: [0, 12, 4.2, 'B1 엘리베이터 탑승 (1호선 노포/2호선 환승)', 'B1 ↔ B2 ↔ B3'],
        L2A: [0, 6, 4.2, 'B2 1호선 노포 방면 승강장', '상대식 승강장(반대편 횡단 불가)'],
        L3A: [0, 0, 4.2, 'B3 2호선 섬식 승강장 하차', '장산·양산 방면 양쪽 탑승 가능'],
        L1B: [0, 12, -4.2, 'B1 엘리베이터 탑승 (1호선 다대포 방면)', 'B1 ↔ B2 상대식 승강장'],
        L2B: [0, 6, -4.2, 'B2 1호선 다대포해수욕장 방면 승강장', '상대식 승강장'],
        W2: [-6, 6, 2.5, 'B2 1호선 승강장 진입', '계단 하차'],
        BN: [-20, 6, 3.5, '1호선 노포 방면 승차 위치', 'B2 상대식 승강장'],
        BN_S: [20, 6, -3.5, '1호선 다대포해수욕장 방면 승차 위치', 'B2 상대식 승강장'],
        E2: [14, 6, 2.5, 'B2→B3 환승 에스컬레이터 입구', '2호선 하행'],
        E3: [6, 0, 2.5, 'B3 2호선 섬식 승강장 진입', '에스컬레이터 하차'],
        BD: [22, 0, 3.5, '2호선 장산·양산 방면 승차 위치', 'B3 섬식 승강장'],
        FR1: [-16, 12, -4.5, '장애인 화장실 도착 (1호선측)', '13번 출구 방향 개찰구 밖'],
        FR2: [16, 12, -4.5, '장애인 화장실 도착 (2호선측)', '5번 출구 방향 개찰구 밖'],
        FC: [-12, 12, 3.8, '전동휠체어 급속충전기 도착', '15번 출구 방향 벽면'],
        FN: [8, 12, -2.5, '모유수유실 도착', '1호선측 역무안전실 안내'],
        FO: [5, 12, -2.5, '역무안전실 도착', '환승 이동 도우미 요청 가능']
      },
      edges: [
        ['X13', 'FR1', 'w', true],
        ['X13', 'WG', 'w', true],
        ['X12', 'W1', 'w', true],
        ['X12', 'WG', 'w', true],
        ['X15', 'FC', 'w', true],
        ['FC', 'WG', 'w', true],
        ['FR1', 'WG', 'w', true],
        ['X5', 'FR2', 'w', true],
        ['X7', 'FR2', 'w', false],
        ['FR2', 'FO', 'w', true],
        ['WG', 'CM', 'w', true],
        ['CM', 'FO', 'w', true],
        ['FO', 'FN', 'w', true],
        ['CM', 'L1A', 'w', true],
        ['CM', 'L1B', 'w', true],
        ['L1A', 'L2A', 'el', true],
        ['L2A', 'L3A', 'el', true],
        ['L1B', 'L2B', 'el', true],
        ['L2B', 'BN_S', 'w', true],
        ['W1', 'W2', 'st', false],
        ['W2', 'L2A', 'w', true],
        ['L2A', 'BN', 'w', true],
        ['L2A', 'E2', 'w', false],
        ['E2', 'E3', 'es', false],
        ['E3', 'L3A', 'w', true],
        ['L3A', 'BD', 'w', true]
      ]
    }
  };
})();

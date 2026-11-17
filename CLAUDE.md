# CLAUDE.md — Claude 작업 지침

이 저장소는 **메트로게이션(Metrogation)** 프로젝트입니다.

## 필수 시작 절차
1. 작업을 시작하기 전에 반드시 루트의 `HANDOVER.md`를 먼저 읽고 현재 진행 상황, 파일 구조, 남은 과제를 파악하세요.
2. 이 프로젝트는 빌드 도구가 없는 순수 HTML/CSS/JS + Three.js r128 웹 앱입니다.
   - 로컬 `file://` 실행 호환을 위해 `import`/`export` 문법을 사용하지 말고 `window.STATION_DATA`, `window.MetrogationRouting`, `window.Metrogation3D` 전역 구조를 유지하세요.
3. 모든 UI 문구, 주석, 설명은 한국어로 작성하세요.
4. 요청받은 기능과 직접 관련된 파일만 수정하고, 다른 파일을 임의로 리팩토링하지 마세요.
5. 작업이 끝나면 `HANDOVER.md`의 **[5. 작업 인수인계 로그]** 표에 날짜, 작업자/AI(`Claude`), 변경 파일, 작업 요약을 한 줄 추가하세요.

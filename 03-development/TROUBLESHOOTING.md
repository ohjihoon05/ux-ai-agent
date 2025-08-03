# Phase 9 트러블슈팅 가이드

## 🚨 현재 상황 (2025-08-02 밤)

### 발생한 문제들
1. **Tailwind CSS PostCSS 오류** ✅ 해결됨
2. **백엔드/프론트엔드 연결 문제** ⚠️ 진행 중
3. **CORS 설정 문제** ⚠️ 부분 해결

### 현재 서버 상태
- 🖥️ **프론트엔드**: http://localhost:5175 (Tailwind 문제 해결 후 재시작)
- ⚙️ **백엔드**: http://localhost:3001 (정상 동작 확인됨)

## 🔧 해결된 문제

### 1. Tailwind CSS PostCSS 플러그인 오류
**오류 메시지**:
```
[postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin
```

**해결 방법**:
```bash
# 1. 패키지 설치
npm install @tailwindcss/postcss

# 2. postcss.config.js 수정
export default {
  plugins: {
    '@tailwindcss/postcss': {},  // 변경됨
    autoprefixer: {},
  },
}
```

## ⚠️ 미해결 문제

### 1. 프론트엔드 API 요청 실패
**오류 증상**:
- 브라우저에서 `"success": false, "message": "요청한 엔드포인트를 찾을 수 없습니다.", "path": "/"`

**원인 분석**:
- CORS 문제일 가능성 높음
- API 경로 문제일 수 있음
- 프론트엔드가 5175 포트에서 실행 중인데 백엔드 CORS 설정에 누락

**시도한 해결책**:
```javascript
// server.js에 CORS 설정 업데이트
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
  credentials: true
}));
```

### 2. Claude Code JSON 파싱 오류
**오류 증상**:
```json
{
  "success": false,
  "meta": {
    "engine": "claude-code",
    "error": "JSON 파싱에 실패했습니다. 기본 설문을 반환합니다."
  }
}
```

**백엔드 API 직접 테스트 결과**:
- API 엔드포인트는 작동함
- Claude Code 서비스에서 JSON 파싱 실패
- 기본 설문으로 폴백 작동 중

## 🎯 내일 해야 할 작업

### 우선순위 1: 네트워크 연결 문제 해결
1. **브라우저 개발자 도구 확인**
   - F12 → Network 탭
   - 실패하는 요청 URL 확인
   - CORS 오류 메시지 확인

2. **CORS 설정 디버깅**
   ```bash
   # 백엔드 재시작
   cd C:\Users\ohjih\UIUX\ux-ai-agent\03-development\backend
   npm run dev
   
   # 프론트엔드 재시작  
   cd C:\Users\ohjih\UIUX\ux-ai-agent\03-development\frontend\ux-research-app
   npm run dev
   ```

3. **API 경로 검증**
   ```bash
   # 직접 테스트
   curl -X POST http://localhost:3001/api/surveys/generate \
     -H "Content-Type: application/json" \
     -H "Origin: http://localhost:5175" \
     -d '{"purpose":"테스트","targetAudience":"사용자","language":"ko"}'
   ```

### 우선순위 2: Claude Code 서비스 수정
1. **파일 기반 통신 디버깅**
   ```javascript
   // claudeCodeService.js의 parseSurveyResponse 함수 확인
   // 임시 파일 경로와 인코딩 문제 점검
   ```

2. **Claude Code CLI 직접 테스트**
   ```bash
   # Claude Code가 정상 작동하는지 확인
   claude --version
   echo "설문 생성 테스트" | claude
   ```

### 우선순위 3: 프론트엔드 에러 핸들링 개선
1. **SurveyGenerator 컴포넌트 디버깅**
   - console.log로 API 요청/응답 확인
   - 에러 메시지 더 상세하게 표시

2. **API 서비스 개선**
   - fetch 오류 시 더 자세한 로그
   - 타임아웃 설정 추가

## 📝 내일 시작할 때 체크리스트

### 1. 환경 확인
- [ ] Node.js 실행 중인지 확인
- [ ] 포트 충돌 없는지 확인 (3001, 5175)
- [ ] Claude Code 설치 상태 확인

### 2. 서버 시작 순서
```bash
# 1. 백엔드 시작
cd C:\Users\ohjih\UIUX\ux-ai-agent\03-development\backend
npm run dev

# 2. 프론트엔드 시작  
cd C:\Users\ohjih\UIUX\ux-ai-agent\03-development\frontend\ux-research-app
npm run dev

# 3. 브라우저에서 확인
# http://localhost:5175 (또는 표시된 포트)
```

### 3. 즉시 테스트할 사항
- [ ] 백엔드 헬스 체크: `curl http://localhost:3001/api/health`
- [ ] 프론트엔드 로딩 확인
- [ ] 브라우저 콘솔에서 CORS 오류 확인
- [ ] 설문 생성 버튼 클릭 시 네트워크 요청 확인

## 🔍 디버깅 명령어 모음

### 백엔드 테스트
```bash
# API 엔드포인트 직접 테스트
curl http://localhost:3001/api/health
curl http://localhost:3001/api/surveys/engines/status
curl -X POST http://localhost:3001/api/surveys/generate \
  -H "Content-Type: application/json" \
  -d '{"purpose":"테스트 설문","targetAudience":"개발자","language":"ko"}'
```

### 프론트엔드 테스트
```bash
# 의존성 재설치 (문제 시)
cd C:\Users\ohjih\UIUX\ux-ai-agent\03-development\frontend\ux-research-app
rm -rf node_modules package-lock.json
npm install

# 빌드 테스트
npm run build
```

### Claude Code 테스트
```bash
# Claude Code 상태 확인
claude --version
claude monitor

# 직접 프롬프트 테스트
claude "다음 JSON 형식으로 설문을 생성해주세요: {title, description, questions: [{id, text, type, required}]}"
```

## 📊 예상 작업 시간
- CORS/연결 문제 해결: 30분
- Claude Code 파싱 수정: 1시간  
- 전체 시스템 테스트: 30분
- **총 예상 시간: 2시간**

## 🎯 Phase 9 완료 목표
- [x] SurveyGenerator 컴포넌트 구현
- [x] HomePage 통합
- [x] Tailwind CSS 문제 해결
- [ ] **프론트엔드-백엔드 연결 완료** ← 내일 목표
- [ ] **설문 생성 기능 정상 작동** ← 내일 목표

## 💡 참고사항
- 백엔드 API는 정상 작동 확인됨 (curl 테스트 성공)
- 프론트엔드 UI는 정상 렌더링됨 (Tailwind 문제 해결)
- 문제는 브라우저-서버 간 통신에 집중되어 있음
- CORS 설정을 업데이트했으므로 재시작 후 테스트 필요

---
*작성일: 2025-08-02 밤*  
*다음 작업: Phase 9 완료를 위한 연결 문제 해결*
# UX Research AI Backend

## 개요
Claude Code와 Ollama를 지원하는 AI 기반 설문 생성 백엔드 서버

## 기능
- **이중 AI 엔진**: Claude Code + Ollama 지원
- **자동 폴백**: 한 엔진 실패시 다른 엔진으로 자동 전환
- **실시간 상태 확인**: AI 엔진 가용성 모니터링
- **설문 생성**: 목적 기반 자동 설문 생성
- **미리보기**: 생성된 설문 HTML 미리보기

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
```bash
cp .env.example .env
# .env 파일 수정
```

### 3. 서버 실행
```bash
# 개발 모드 (nodemon)
npm run dev

# 프로덕션 모드
npm start
```

서버가 http://localhost:3001 에서 실행됩니다.

## AI 엔진 설정

### Claude Code
- 이미 설치되어 있으면 별도 설정 불필요
- `claude --version`으로 설치 확인

### Ollama
1. Ollama 설치: https://ollama.ai
2. 서버 실행: `ollama serve`
3. 모델 설치: `ollama pull llama3.2`

## API 엔드포인트

### 서버 상태
- `GET /api/health` - 서버 상태 확인
- `GET /api` - API 문서

### AI 엔진 관리
- `GET /api/surveys/engines` - 지원 엔진 목록
- `GET /api/surveys/engines/status` - 엔진 상태 확인

### 설문 생성
- `POST /api/surveys/generate` - AI 설문 생성
- `GET /api/surveys/templates` - 설문 템플릿 목록
- `POST /api/surveys/preview` - 설문 미리보기

## 요청 예시

### 설문 생성
```bash
curl -X POST http://localhost:3001/api/surveys/generate \
  -H "Content-Type: application/json" \
  -d '{
    "purpose": "사용자 만족도 조사",
    "targetAudience": "웹 애플리케이션 사용자",
    "language": "ko",
    "engine": "claude-code"
  }'
```

### 엔진 상태 확인
```bash
curl http://localhost:3001/api/surveys/engines/status
```

## 프로젝트 구조
```
backend/
├── services/           # AI 서비스
│   ├── aiService.js   # 통합 AI 서비스
│   ├── claudeCodeService.js
│   └── ollamaService.js
├── routes/            # API 라우트
│   └── surveys.js
├── temp/              # 임시 파일 (자동 생성)
├── server.js          # 메인 서버
├── package.json
└── README.md
```

## 트러블슈팅

### Claude Code 사용 불가
- `claude --version` 확인
- Claude Code 재설치 필요시 공식 문서 참조

### Ollama 연결 실패
- `ollama serve` 실행 확인
- 포트 11434 사용 가능 확인
- 방화벽 설정 확인

### 권한 오류 (Windows)
- 관리자 권한으로 터미널 실행
- PowerShell 실행 정책 확인

## Phase 8 완료 ✅
- Claude Code 서비스 구현
- Ollama 서비스 구현  
- 통합 AI 서비스
- Express 서버 설정
- API 라우트 구현
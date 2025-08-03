# UX Research AI Agent - 개발 환경 설정 가이드

## 📋 개요
이 프로젝트는 AI를 활용한 설문 자동 생성 시스템입니다.
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **AI Engines**: Claude Code, Ollama

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
# Backend 의존성 설치
cd 03-development/backend
npm install

# Frontend 의존성 설치
cd ../frontend/ux-research-app
npm install
```

### 2. 환경 변수 설정
```bash
# Backend 환경 변수
cd ../../backend
cp .env.example .env

# Frontend 환경 변수
cd ../frontend/ux-research-app
cp .env.example .env
```

### 3. 서버 실행
#### 방법 1: 자동 스크립트 (권장)
```bash
# 프로젝트 루트에서
./start.bat  # Windows
```

#### 방법 2: 수동 실행
```bash
# Terminal 1: Backend
cd 03-development/backend
npm run dev

# Terminal 2: Frontend
cd 03-development/frontend/ux-research-app
npm run dev
```

## 🔧 AI 엔진 설정

### Claude Code (기본 엔진)
```bash
# Claude CLI 설치 확인
claude --version

# 설치되지 않은 경우
npm install -g @anthropic-ai/claude-cli
```

### Ollama (대안 엔진)
```bash
# Ollama 설치 및 실행
ollama serve

# 모델 다운로드
ollama pull gemma3:1b
```

## 📡 API 엔드포인트

### 헬스 체크
- `GET /api/health` - 서버 상태 확인

### AI 엔진 관리
- `GET /api/surveys/engines` - 지원 AI 엔진 목록
- `GET /api/surveys/engines/status` - AI 엔진 상태 확인

### 설문 생성
- `POST /api/surveys/generate` - AI 설문 생성
- `GET /api/surveys/templates` - 설문 템플릿 목록
- `POST /api/surveys/preview` - 설문 미리보기

## 🧪 테스트

### API 테스트
```bash
# 헬스 체크
curl http://localhost:3001/api/health

# AI 엔진 상태
curl http://localhost:3001/api/surveys/engines/status

# 설문 생성 테스트
curl -X POST http://localhost:3001/api/surveys/generate \
  -H "Content-Type: application/json" \
  -d '{"purpose":"웹사이트 사용성 테스트","targetAudience":"20-30대 직장인","language":"ko","engine":"claude-code"}'
```

### Frontend 테스트
1. 브라우저에서 `http://localhost:5173` 접속
2. "설문 만들기 시작" 버튼 클릭
3. 설문 목적 입력 후 "설문 생성하기" 클릭

## 🚨 문제 해결

### 1. Backend 서버가 시작되지 않는 경우
```bash
# 포트 충돌 확인
netstat -ano | findstr :3001

# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
```

### 2. Frontend 빌드 오류
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# TypeScript 캐시 삭제
rm -rf .vite
```

### 3. AI 엔진 연결 오류
```bash
# Claude Code 확인
claude --version

# Ollama 서버 확인
curl http://localhost:11434/api/tags
```

## 📂 프로젝트 구조

```
03-development/
├── backend/
│   ├── services/           # AI 서비스
│   │   ├── aiService.js
│   │   ├── claudeCodeService.js
│   │   └── ollamaService.js
│   ├── routes/            # API 라우트
│   │   └── surveys.js
│   ├── temp/              # 임시 파일
│   └── server.js          # 메인 서버
├── frontend/
│   └── ux-research-app/
│       ├── src/
│       │   ├── components/    # React 컴포넌트
│       │   ├── services/      # API 서비스
│       │   ├── types/         # TypeScript 타입
│       │   └── pages/         # 페이지 컴포넌트
│       └── public/
└── SETUP_GUIDE.md         # 이 파일
```

## 🔐 보안 고려사항

1. **환경 변수**: 민감한 정보는 `.env` 파일에 저장
2. **CORS 설정**: 허용된 도메인만 API 접근 가능
3. **입력 검증**: 모든 API 입력값 검증
4. **에러 처리**: 민감한 정보 노출 방지

## 📈 성능 최적화

1. **Frontend**:
   - React 컴포넌트 메모이제이션
   - 이미지 최적화
   - 코드 스플리팅

2. **Backend**:
   - 응답 압축
   - 캐싱 전략
   - 요청 제한

## 🆘 지원

문제가 발생하면 다음을 확인하세요:
1. Node.js 버전: 18.0.0 이상
2. 포트 충돌: 3001(Backend), 5173(Frontend)
3. AI 엔진 상태: Claude Code, Ollama 연결 상태
4. 네트워크 연결: 인터넷 연결 상태

---

**개발팀**: UX Research AI Team  
**마지막 업데이트**: 2025-08-03
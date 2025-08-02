# UX Research AI - Frontend

## 프로젝트 개요
원익IPS UX 리서치 자동화를 위한 AI 기반 설문 생성 및 분석 플랫폼

## 개발 환경 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.example` 파일을 `.env`로 복사하고 다음 값들을 설정:
- OpenAI API 키
- Firebase 프로젝트 설정

### 3. 개발 서버 실행
```bash
npm run dev
# http://localhost:5173에서 확인
```

## 기술 스택
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (예정)
- **State Management**: Zustand (예정)
- **API**: OpenAI GPT-4
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth

## 프로젝트 구조
```
src/
├── components/     # 재사용 가능한 컴포넌트
├── pages/         # 페이지 컴포넌트
├── services/      # API 서비스
├── hooks/         # 커스텀 훅
├── utils/         # 유틸리티 함수
├── types/         # TypeScript 타입 정의
└── styles/        # 전역 스타일
```

## 주요 기능
1. **AI 설문 생성**: 목적 입력 → 자동 질문 생성
2. **응답 수집**: 실시간 폼 제출 및 저장
3. **분석 대시보드**: 응답 분석 및 인사이트 도출
4. **보고서 생성**: PDF 형식 리포트 출력

## Phase 4 완료 ✅
- Vite + React + TypeScript 프로젝트 생성
- 기본 설정 파일 구성
- 환경 변수 템플릿 생성
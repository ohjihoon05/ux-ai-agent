# 프론트엔드 프로젝트 구조 (Phase 6 완료)

## 📁 폴더 구조
```
src/
├── components/           # 재사용 가능한 컴포넌트
│   ├── layout/          # 레이아웃 컴포넌트
│   │   └── Header.tsx   # 공통 헤더
│   ├── ui/              # 기본 UI 컴포넌트
│   │   ├── Button.tsx   # 버튼 컴포넌트
│   │   └── FeatureCard.tsx # 기능 카드
│   └── index.ts         # 컴포넌트 export
├── pages/               # 페이지 컴포넌트
│   └── HomePage.tsx     # 랜딩 페이지
├── services/            # API 서비스
│   └── api.ts          # API 통신 로직
├── hooks/               # 커스텀 훅
│   └── useSurvey.ts    # 설문 관련 훅
├── utils/               # 유틸리티 함수
│   └── index.ts        # 공통 함수들
├── types/               # TypeScript 타입 정의
│   └── index.ts        # 전역 타입
├── App.tsx             # 메인 앱 컴포넌트
└── index.css           # Tailwind CSS
```

## 🔧 컴포넌트 설계 원칙

### 1. Layout Components
- **Header**: 공통 네비게이션
- 재사용성과 일관성 중심

### 2. UI Components  
- **Button**: 다양한 스타일 variant 지원
- **FeatureCard**: 아이콘, 제목, 설명 구조화
- Props 인터페이스로 타입 안정성 확보

### 3. Pages
- **HomePage**: 랜딩 페이지
- 컴포넌트 조합으로 페이지 구성

### 4. Services
- **apiService**: RESTful API 통신
- 타입 안전한 API 호출
- 에러 핸들링 포함

### 5. Hooks
- **useSurveys**: 설문 목록 관리
- **useSurveyGeneration**: AI 설문 생성
- 상태 관리 로직 분리

### 6. Types
- Survey, Question, Answer 등 핵심 타입
- API 응답 타입
- 컴포넌트 Props 타입

### 7. Utils
- 날짜/문자열 포맷팅
- 유효성 검사
- 로컬 스토리지 관리

## 🎯 설계 의도

1. **모듈화**: 기능별 폴더 분리
2. **재사용성**: 공통 컴포넌트 추출
3. **타입 안정성**: TypeScript 적극 활용
4. **확장성**: 새 기능 추가 용이
5. **유지보수성**: 명확한 책임 분리

## 🚀 다음 단계 예정
- 라우팅 (React Router)
- 상태 관리 (Zustand)
- 폼 처리 (React Hook Form)
- 테스트 (Vitest + Testing Library)
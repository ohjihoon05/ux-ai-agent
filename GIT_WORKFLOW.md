# Git 워크플로우 가이드

## 🌳 브랜치 전략

### Main Branches
- **main**: 프로덕션 배포용 안정 브랜치
- **develop**: 개발 통합 브랜치

### Feature Branches
- **feature/phase-X**: 각 Phase별 기능 개발
- **feature/component-name**: 특정 컴포넌트 개발
- **fix/bug-description**: 버그 수정

### 브랜치 명명 규칙
```bash
feature/phase-8-api-setup
feature/survey-generator
feature/dashboard-ui
fix/header-responsive
fix/api-error-handling
```

## 📝 커밋 메시지 규칙

### 커밋 타입
- **feat**: 새 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 수정
- **style**: 코드 포맷팅 (기능 변경 없음)
- **refactor**: 코드 리팩토링
- **test**: 테스트 추가/수정
- **chore**: 빌드/설정 변경

### 커밋 메시지 형식
```
타입(범위): 간단한 설명

상세 설명 (선택사항)

관련 이슈: #123
```

### 예시
```bash
feat(ui): Button 컴포넌트 variant 옵션 추가

primary, secondary, outline 3가지 스타일 지원
크기 옵션도 sm, md, lg로 확장

관련 Phase: Phase 6
```

## 🔄 워크플로우 절차

### 1. 새 기능 개발
```bash
# develop 브랜치에서 시작
git checkout develop
git pull origin develop

# feature 브랜치 생성
git checkout -b feature/phase-8-api-setup

# 개발 작업...
git add .
git commit -m "feat(api): OpenAI API 서비스 클래스 구현"

# 원격 브랜치에 푸시
git push origin feature/phase-8-api-setup
```

### 2. 브랜치 병합
```bash
# develop으로 병합
git checkout develop
git merge feature/phase-8-api-setup
git push origin develop

# feature 브랜치 삭제
git branch -d feature/phase-8-api-setup
git push origin --delete feature/phase-8-api-setup
```

### 3. 프로덕션 배포
```bash
# main 브랜치로 병합 (안정 버전만)
git checkout main
git merge develop
git tag v1.0.0
git push origin main --tags
```

## 📋 Phase별 브랜치 관리

### Phase 1-15: 기초 환경
- `feature/phase-1-5-setup`: 프로젝트 초기화
- `feature/phase-6-10-structure`: 구조 설계
- `feature/phase-11-15-database`: DB 설정

### Phase 16-30: 설계
- `feature/phase-16-20-research`: 사용자 리서치
- `feature/phase-21-25-design`: UI/UX 설계
- `feature/phase-26-30-architecture`: 시스템 설계

### Phase 31-60: 개발
- `feature/phase-31-40-backend`: 백엔드 기초
- `feature/phase-41-50-frontend`: 프론트엔드 기초
- `feature/phase-51-60-integration`: 기능 통합

## 🛡️ 보호 규칙

### main 브랜치
- 직접 push 금지
- Pull Request를 통한 병합만 허용
- 코드 리뷰 필수

### develop 브랜치
- 기능 브랜치에서만 병합 허용
- 충돌 해결 후 병합

## 📁 Git 구조
```
ux-ai-agent/
├── .git/
├── .gitignore
├── README.md
├── CLAUDE.md
├── GIT_WORKFLOW.md
└── (프로젝트 파일들...)
```

## 🚀 현재 상태 (Phase 7)
- Git 저장소 초기화 완료
- .gitignore 설정 완료
- 브랜치 전략 수립 완료
- 첫 커밋 준비 완료
# Component Library with MCP Integration

Modern UI component library with AI-powered MCP server for seamless component generation and customization.

---

## 🎯 핵심 정리

**질문에 대한 답변**:
- ❌ Claude Desktop 필수 아님
- ✅ **Claude Code에서 바로 사용 가능** (추천!)
- ✅ 웹사이트도 독립적으로 작동
- ✅ MCP 서버는 선택사항

---

## 🚀 빠른 시작

### 웹사이트만 사용 (가장 간단)

```bash
# 1. 데이터베이스 초기화
cd website
node src/db/init.js
node src/db/seed.js

# 2. 서버 실행
node src/api/server.js   # 터미널 1
npm run dev:vite         # 터미널 2

# 3. 브라우저 접속
# http://localhost:3000
```

---

### Claude Code에서 사용 (AI 자동화)

✅ **이미 설정 완료!** 바로 사용하세요.

```
You: 버튼 컴포넌트 검색해줘
You: GlassButton 만들어줘
You: 로그인 폼 만들어줘
```

**설정 파일**: `~/.claude/settings.json`

**상세 가이드**: [CLAUDE_CODE_SETUP.md](CLAUDE_CODE_SETUP.md)

---

## 📂 프로젝트 구조

```
design_mcp_server/
├── website/              # 웹사이트 (사람용)
│   ├── index.html
│   ├── src/api/         # REST API
│   ├── src/db/          # SQLite DB
│   └── src/scripts/     # Frontend JS
│
├── mcp-server/          # MCP 서버 (AI용)
│   ├── src/tools/       # 4개 AI 도구
│   └── dist/            # 빌드 결과
│
└── database.sqlite      # 공유 DB (7개 컴포넌트)
```

---

## 🎨 포함된 컴포넌트

1. **GlassButton** - Glassmorphism 버튼 (3 variants)
2. **GradientButton** - 그라데이션 버튼 (3 variants)
3. **NeumorphButton** - Neumorphism 버튼
4. **GlassCard** - 글래스 카드
5. **ProductCard** - 상품 카드
6. **ModernInput** - 플로팅 라벨 입력
7. **GlassNavbar** - 네비게이션 바

**디자인 트렌드**: 2024-2025 (Glassmorphism, Gradient, Neumorphism)

---

## 💡 사용 방법 비교

### 방법 1: 웹사이트 🌐

```
1. http://localhost:3000 접속
2. 컴포넌트 검색/필터
3. 코드 복사
4. 프로젝트에 붙여넣기
```

**장점**: 시각적, 직관적, 미리보기

---

### 방법 2: Claude Code 🤖

```
You: "로그인 폼 만들어줘"

Claude Code:
→ ModernInput 2개 + GlassButton 1개
→ vertical stack으로 조합
→ 완성된 코드 제공!
```

**장점**: 자동화, 빠름, 조합 가능, 대화형

---

## 🛠️ MCP 도구 (AI용)

### 1. search-components
컴포넌트 검색

### 2. generate-component  
컴포넌트 코드 생성

### 3. apply-design-system
브랜드 컬러/폰트 적용

### 4. combine-layout
여러 컴포넌트 조합

---

## 📊 완료 현황

✅ **User Story 1 (P1)**: 웹사이트 - 94% (17/18) **MVP!**
✅ **User Story 2 (P2)**: MCP 서버 - 100% (15/15) **완료!**

**전체**: 52% (52/100 tasks)

---

## 🎓 가이드 문서

1. **[CLAUDE_CODE_SETUP.md](CLAUDE_CODE_SETUP.md)** ⭐ 추천!
2. **[CLAUDE_DESKTOP_SETUP.md](CLAUDE_DESKTOP_SETUP.md)**
3. **[MCP_TEST_REPORT.md](MCP_TEST_REPORT.md)** - 테스트 결과
4. **[mcp-server/README.md](mcp-server/README.md)** - MCP 상세

---

## 🆚 Claude Desktop vs Claude Code

| 항목 | Claude Code | Claude Desktop |
|------|-------------|----------------|
| 설정 위치 | `~/.claude/settings.json` | OS 시스템 설정 |
| 재시작 필요 | ❌ | ✅ |
| 코딩 통합 | ✅ 자연스러움 | ⚠️ 전환 필요 |
| 설치 | 이미 사용 중 | 별도 앱 |
| **추천** | ⭐⭐⭐ | ⭐ |

**결론**: 코딩할 때는 **Claude Code가 훨씬 편함!**

---

## 🐛 문제 해결

### 웹사이트 접속 안 됨

```bash
cd website
node src/api/server.js   # 포트 3001
npm run dev:vite         # 포트 3000
```

### MCP 도구 안 보임

```bash
# 빌드 확인
cd mcp-server
npm run build

# 설정 확인  
cat ~/.claude/settings.json

# 새 대화 시작
```

### 데이터베이스 문제

```bash
cd website
node src/db/init.js
node src/db/seed.js
```

---

## 🎯 실전 예시

### Claude Code 사용

```
You: 프로필 카드 만들어줘. 
     위에 이미지, 중간에 이름/직책, 아래 버튼

Claude Code:
→ GlassCard 검색
→ GlassButton 검색  
→ 레이아웃 조합
→ 완성된 프로필 카드 코드 제공!
```

### 브랜드 커스터마이징

```
You: 버튼 만들고 primary 컬러를 #FF6B6B로 바꿔줘

Claude Code:
→ generate-component(GlassButton)
→ apply-design-system(colors: {primary: "#FF6B6B"})
→ 브랜드 컬러가 적용된 버튼 제공!
```

---

## 🔧 기술 스택

- **Frontend**: Vanilla JS, TailwindCSS 3.x
- **Build**: Vite 5.x
- **Database**: SQLite (better-sqlite3)
- **Search**: FTS5
- **API**: Node.js HTTP
- **MCP**: @modelcontextprotocol/sdk

---

## 📞 추가 자료

- MCP SDK: https://github.com/anthropics/mcp-sdk
- Claude Docs: https://docs.claude.com
- TailwindCSS: https://tailwindcss.com

---

## 🎉 결론

**2가지 방법 모두 사용 가능:**

1. 🌐 **웹사이트**: http://localhost:3000 (직접 탐색)
2. 🤖 **Claude Code**: 이미 설정됨! (AI 자동화)

**MCP는 선택사항이며, 웹사이트만으로도 충분히 사용 가능합니다!**

---

**Built by**: UX Designer @ 원익IPS  
**Date**: 2025-10-07

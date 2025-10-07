# Claude Code MCP 서버 사용 가이드

## ✅ 설정 완료!

Component Library MCP 서버가 **Claude Code에 자동으로 설정**되었습니다!

설정 파일: `~/.claude/settings.json`

```json
{
  "mcpServers": {
    "component-library": {
      "command": "node",
      "args": [
        "C:\\Users\\ohjih\\design_mcp_server\\mcp-server\\dist\\index.js"
      ]
    }
  }
}
```

---

## 🚀 Claude Code에서 바로 사용하기

### Claude Code 재시작 필요 없음!

설정이 즉시 적용됩니다. 새로운 대화를 시작하면 MCP 도구를 사용할 수 있습니다.

---

## 💬 사용 예시

### 예시 1: 컴포넌트 검색

```
You: 버튼 컴포넌트를 검색해줘

Claude Code: (search-components 도구 자동 호출)
             → GlassButton, GradientButton, NeumorphButton 발견!
```

### 예시 2: 컴포넌트 생성

```
You: GlassButton을 "Get Started" 텍스트로 만들어줘

Claude Code: (generate-component 도구 자동 호출)
             → 완성된 HTML/CSS/JS 코드 제공!
```

### 예시 3: 디자인 시스템 적용

```
You: 이 버튼에 내 브랜드 컬러(primary: #FF6B6B)를 적용해줘

Claude Code: (apply-design-system 도구 자동 호출)
             → 브랜드 컬러가 적용된 코드 제공!
```

### 예시 4: 레이아웃 조합

```
You: 로그인 폼 만들어줘. ModernInput 2개랑 GlassButton 1개를 vertical stack으로

Claude Code: (search-components로 컴포넌트 찾기)
             (combine-layout으로 조합)
             → 완성된 로그인 폼 코드 제공!
```

---

## 🎯 Claude Code vs Claude Desktop

| 항목 | Claude Code | Claude Desktop |
|------|-------------|----------------|
| **설정 위치** | `~/.claude/settings.json` | OS별 시스템 설정 |
| **재시작 필요** | ❌ 불필요 | ✅ 필요 |
| **프로젝트별 설정** | ✅ 가능 | ❌ 전역만 |
| **코딩 중 사용** | ✅ 자연스러움 | ⚠️ 전환 필요 |
| **파일 참조** | ✅ 직접 연결 | ⚠️ 수동 복사 |
| **설치** | 이미 사용 중 | 별도 앱 설치 |

**결론**: 개발 중에는 **Claude Code가 훨씬 편합니다!** 🎉

---

## 🔧 고급 설정 (선택사항)

### 프로젝트별 MCP 설정

현재는 전역 설정(`~/.claude/settings.json`)을 사용하지만, 프로젝트별로도 설정 가능:

```bash
# 프로젝트 루트에 .claude 디렉토리 생성
cd /c/Users/ohjih/design_mcp_server
mkdir -p .claude

# 프로젝트별 설정 파일
cat > .claude/config.json << 'EOF'
{
  "mcpServers": {
    "component-library": {
      "command": "node",
      "args": ["./mcp-server/dist/index.js"]
    }
  }
}
EOF
```

이렇게 하면 이 프로젝트에서만 MCP가 활성화됩니다.

---

## 🧪 테스트하기

### 1. 새 대화 시작

Claude Code에서 새 대화를 시작하세요.

### 2. MCP 도구 확인

```
You: 사용 가능한 도구를 보여줘
```

다음 4가지 도구가 보여야 합니다:
- search-components
- generate-component
- apply-design-system
- combine-layout

### 3. 실제 사용

```
You: "button"을 검색해서 사용 가능한 컴포넌트를 보여줘
```

MCP 서버가 정상 작동하면 3개의 버튼 컴포넌트를 찾아줍니다!

---

## 🎓 실전 시나리오

### 시나리오: 프로필 카드 UI 만들기

```
You: 프로필 카드를 만들고 싶어.
     위쪽에 이미지, 중간에 이름/직책, 아래에 버튼이 있어야 해.

Claude Code:
1. search-components("card")로 GlassCard 발견
2. search-components("button")로 GlassButton 발견
3. combine-layout으로 구조 조합
4. 이미지/텍스트 추가
5. 완성된 프로필 카드 코드 제공!

→ 코드가 현재 파일에 바로 삽입되거나 새 파일로 생성됨
```

---

## 🆚 다른 MCP 클라이언트와 비교

### Claude Code (현재 사용 중) ⭐ 추천!

**장점**:
- ✅ 이미 설치되어 있음
- ✅ 코딩 워크플로우에 자연스럽게 통합
- ✅ 파일 시스템 직접 접근
- ✅ 코드 편집 중 실시간 도움
- ✅ 설정 즉시 적용 (재시작 불필요)

**단점**:
- 없음 (개발 용도로는 최적)

### Claude Desktop

**장점**:
- 일반 대화용
- 개발 외 작업에 적합

**단점**:
- ❌ 별도 앱 설치 필요
- ❌ 재시작 필요
- ❌ 파일 전환 번거로움

### Cline (VSCode Extension)

**장점**:
- VSCode 통합
- MCP 지원

**단점**:
- VSCode 전용
- 별도 설정 필요

---

## 🐛 문제 해결

### MCP 도구가 보이지 않을 때

1. **설정 파일 확인**
   ```bash
   cat ~/.claude/settings.json
   ```

2. **MCP 서버 빌드 확인**
   ```bash
   cd mcp-server
   npm run build
   ```

3. **데이터베이스 확인**
   ```bash
   ls -la database.sqlite
   ```

4. **새 대화 시작**

   이전 대화에서는 MCP 설정이 반영 안 될 수 있습니다.

### 로그 확인

```bash
# Claude Code 로그
ls ~/.claude/logs/

# 최신 로그 보기
tail -f ~/.claude/logs/mcp-*.log
```

---

## 📊 사용 가능한 도구 상세

### 1. search-components

**용도**: 컴포넌트 검색

**파라미터**:
- `query` (string, optional): 검색어
- `category` (string, optional): 카테고리 필터
- `limit` (number, optional): 최대 결과 수

**예시**:
```
"button"으로 검색해줘
카드 카테고리의 컴포넌트를 5개만 보여줘
```

---

### 2. generate-component

**용도**: 컴포넌트 코드 생성

**파라미터**:
- `name` (string, required): 컴포넌트 이름
- `variant` (string, optional): 변형 이름
- `props` (object, optional): 커스텀 속성

**예시**:
```
GlassButton을 만들어줘
GradientButton의 secondary variant로 만들어줘
GlassButton을 text="Sign Up" 속성으로 만들어줘
```

---

### 3. apply-design-system

**용도**: 디자인 시스템 적용

**파라미터**:
- `componentCode` (string, required): 컴포넌트 코드
- `designSystem` (object, required): 디자인 시스템 설정
  - `colors`: {primary, secondary, accent}
  - `fonts`: {heading, body, size}
  - `spacing`: {unit, scale}

**예시**:
```
이 버튼에 primary 컬러를 #0066cc로 바꿔줘
폰트를 'Pretendard'로 바꾸고 크기를 1.2배로 키워줘
```

---

### 4. combine-layout

**용도**: 여러 컴포넌트를 레이아웃으로 조합

**파라미터**:
- `components` (array, required): 컴포넌트 리스트
- `layout` (string, optional): 레이아웃 타입 (stack/grid/flex)

**예시**:
```
GlassCard 2개를 grid로 배치해줘
ModernInput, GlassButton을 vertical stack으로 조합해줘
```

---

## 💡 팁 & 트릭

### Tip 1: 자연어로 편하게 요청

```
❌ generate-component(name="GlassButton", variant="primary")
✅ "유리 같은 버튼 만들어줘"
```

Claude Code가 알아서 적절한 도구를 선택합니다!

### Tip 2: 연속 작업

```
You: 버튼 검색해줘
     → (결과 확인)
You: GlassButton을 primary variant로 만들어줘
     → (코드 생성)
You: 여기에 내 브랜드 컬러 적용해줘
     → (디자인 시스템 적용)
```

### Tip 3: 컨텍스트 활용

```
You: 로그인 폼을 만들고 싶어
     [파일 선택: login.html]

Claude Code:
- 현재 파일 컨텍스트 파악
- 적절한 컴포넌트 검색
- 기존 스타일에 맞춰 조합
- login.html에 직접 삽입!
```

---

## 🎉 결론

**Claude Code에서 MCP 사용 준비 완료!**

이제 코딩하면서 자연스럽게 컴포넌트 라이브러리를 활용할 수 있습니다:

```
You: 대시보드 만들어야 하는데 네비게이션바 필요해

Claude Code: (MCP로 GlassNavbar 검색 및 생성)
             → 코드 제공 및 파일 삽입!
```

**더 이상 웹사이트로 이동해서 복사/붙여넣기 할 필요 없습니다!** 🚀

---

## 📚 추가 자료

- **MCP 서버 문서**: `mcp-server/README.md`
- **Claude Code 문서**: https://docs.claude.com
- **MCP SDK**: https://github.com/anthropics/mcp-sdk

---

**설정 완료! 이제 바로 사용하세요!** 😊

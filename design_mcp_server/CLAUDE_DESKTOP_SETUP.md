# Claude Desktop MCP Server Setup

## Component Library MCP Server 설정 가이드

이 가이드는 Claude Desktop에서 Component Library MCP Server를 사용하는 방법을 안내합니다.

---

## 1. 사전 준비

### 필요한 것
- ✅ Claude Desktop (최신 버전)
- ✅ Node.js 18 이상
- ✅ Component Library 프로젝트 (이미 설치됨)

### 확인 사항
```bash
# Node.js 버전 확인
node --version  # v18.0.0 이상이어야 함

# MCP 서버 빌드 확인
cd mcp-server
npm run build
```

---

## 2. Claude Desktop 설정 파일 위치

### Windows
```
C:\Users\{사용자명}\AppData\Roaming\Claude\claude_desktop_config.json
```

### macOS
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

### Linux
```
~/.config/Claude/claude_desktop_config.json
```

---

## 3. 설정 파일 수정

설정 파일을 열고 다음 내용을 추가하세요:

### Windows 설정 예시

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

**⚠️ 중요**: 경로는 반드시 **절대 경로**를 사용하고, 백슬래시(`\`)를 두 개(`\\`)로 작성해야 합니다!

### macOS/Linux 설정 예시

```json
{
  "mcpServers": {
    "component-library": {
      "command": "node",
      "args": [
        "/absolute/path/to/design_mcp_server/mcp-server/dist/index.js"
      ]
    }
  }
}
```

---

## 4. 경로 확인 방법

### Windows (PowerShell)
```powershell
# 현재 디렉토리의 절대 경로 확인
(Get-Location).Path

# 예시 출력
# C:\Users\ohjih\design_mcp_server
```

설정 파일에는 다음과 같이 입력:
```
C:\\Users\\ohjih\\design_mcp_server\\mcp-server\\dist\\index.js
```

### macOS/Linux (Terminal)
```bash
# 현재 디렉토리의 절대 경로 확인
pwd

# 예시 출력
# /Users/username/design_mcp_server
```

설정 파일에는 다음과 같이 입력:
```
/Users/username/design_mcp_server/mcp-server/dist/index.js
```

---

## 5. Claude Desktop 재시작

설정 파일을 저장한 후 반드시 **Claude Desktop을 완전히 종료하고 다시 시작**하세요.

### Windows
- Claude Desktop 우클릭 → 종료
- 시작 메뉴에서 Claude Desktop 다시 실행

### macOS
- Cmd + Q로 완전히 종료
- Claude Desktop 다시 실행

---

## 6. 동작 확인

Claude Desktop을 재시작한 후:

1. 새 대화 시작
2. 다음과 같이 입력:

```
search-components 도구를 사용해서 버튼 컴포넌트를 찾아줘
```

또는

```
Use the search-components tool to find button components
```

3. Claude가 MCP 도구를 사용하면 성공! 🎉

---

## 7. 사용 가능한 도구

### 1️⃣ search-components
컴포넌트 검색

**예시**:
```
"button"을 검색해서 사용 가능한 컴포넌트를 보여줘
```

### 2️⃣ generate-component
컴포넌트 코드 생성

**예시**:
```
GlassButton 컴포넌트를 "Get Started" 텍스트로 생성해줘
```

### 3️⃣ apply-design-system
디자인 시스템 적용

**예시**:
```
이 버튼에 내 브랜드 컬러(primary: #0066cc)를 적용해줘
```

### 4️⃣ combine-layout
여러 컴포넌트 조합

**예시**:
```
GlassCard와 GradientButton을 vertical stack으로 조합해줘
```

---

## 8. 문제 해결 (Troubleshooting)

### MCP 서버가 목록에 나타나지 않음

**해결 방법**:
1. 설정 파일 경로 확인
2. JSON 문법 오류 확인 (쉼표, 중괄호 등)
3. 경로가 절대 경로인지 확인
4. Windows의 경우 백슬래시를 `\\`로 작성했는지 확인
5. Claude Desktop 완전 재시작

### 로그 확인

#### Windows
```
C:\Users\{사용자명}\AppData\Roaming\Claude\logs\
```

#### macOS
```
~/Library/Logs/Claude/
```

`mcp-*.log` 파일에서 오류 메시지 확인

### 데이터베이스 오류

데이터베이스가 없다는 오류가 나면:

```bash
cd design_mcp_server/website
node src/db/init.js
node src/db/seed.js
```

---

## 9. 실제 사용 예시

### 시나리오 1: 로그인 폼 만들기

```
User: 로그인 폼을 만들고 싶어. 이메일 입력, 비밀번호 입력, 그리고 로그인 버튼이 필요해.

Claude: (search-components로 input과 button 컴포넌트를 찾음)
        (generate-component로 각 컴포넌트 생성)
        (combine-layout으로 세 개의 컴포넌트를 vertical stack으로 조합)

        완성된 로그인 폼 코드를 제공합니다!
```

### 시나리오 2: 브랜드 디자인 적용

```
User: 우리 회사 브랜드 컬러는 primary: #FF6B6B, secondary: #4ECDC4야.
      버튼 컴포넌트에 이걸 적용해줘.

Claude: (generate-component로 버튼 생성)
        (apply-design-system으로 브랜드 컬러 적용)

        브랜드 디자인이 적용된 버튼 코드를 제공합니다!
```

---

## 10. 추가 정보

### MCP 서버 업데이트

코드를 수정한 후:

```bash
cd mcp-server
npm run build
```

Claude Desktop 재시작 필요 없음 (자동으로 새 빌드 사용)

### 개발 모드로 실행

```bash
cd mcp-server
npm run dev
```

파일 변경 시 자동 재시작

---

## 11. 문의 및 지원

- **프로젝트 README**: `mcp-server/README.md`
- **MCP SDK 문서**: https://github.com/anthropics/mcp-sdk
- **Claude Desktop 문서**: https://claude.ai/docs

---

**설정 완료!** 이제 Claude Desktop에서 Component Library MCP 서버를 사용할 수 있습니다! 🚀

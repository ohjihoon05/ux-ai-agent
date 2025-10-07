# 🚀 Figma-to-Web MCP Server 구축 계획

## 📋 프로젝트 개요

회사에서 웹 프로젝트를 만들 때 shadcn이나 magic MCP처럼 쉽게 불러올 수 있는 커스텀 MCP 서버를 구축합니다. 현재 `figma-to-web-spec-kit`의 디자인 패턴과 컴포넌트들을 MCP 서버로 변환하여, Claude나 다른 AI 도구에서 즉시 사용 가능하도록 만듭니다.

## 🎯 핵심 목표

1. **즉시 사용 가능한 컴포넌트 제공**
   - Glassmorphism 카드, 그라데이션 버튼, 애니메이션 등
   - 2024-2025 최신 디자인 트렌드 반영

2. **Figma 디자인 변환 자동화**
   - Figma URL 입력 → HTML/CSS 코드 자동 생성
   - 디자인 토큰 자동 추출

3. **회사 디자인 시스템 통합**
   - 원익IPS 브랜드 컬러와 패턴 내장
   - 일관된 디자인 언어 유지

## 🏗️ 기술 스택

- **Language**: TypeScript
- **Runtime**: Node.js
- **SDK**: @modelcontextprotocol/sdk
- **Styling**: Tailwind CSS + Custom CSS
- **Build Tool**: TypeScript Compiler (tsc)
- **Module System**: ES Modules (NodeNext)

## 📂 프로젝트 구조

```
figma-to-web-mcp-server/
├── package.json                    # Node.js 프로젝트 설정
├── tsconfig.json                  # TypeScript 설정
├── README.md                      # 사용 문서
├── src/
│   ├── index.ts                   # MCP 서버 진입점
│   ├── server.ts                  # MCP 서버 설정
│   ├── tools/                     # MCP 도구들
│   │   ├── component-generator.ts # 컴포넌트 생성 도구
│   │   ├── figma-converter.ts    # Figma 변환 도구
│   │   ├── style-applier.ts      # 스타일 적용 도구
│   │   └── template-manager.ts   # 템플릿 관리 도구
│   ├── patterns/                  # 디자인 패턴 라이브러리
│   │   ├── glassmorphism.ts      # 글래스모피즘 패턴
│   │   ├── gradients.ts          # 그라데이션 패턴
│   │   ├── animations.ts         # 애니메이션 패턴
│   │   ├── neomorphism.ts        # 네오모피즘 패턴
│   │   └── micro-interactions.ts # 마이크로 인터랙션
│   ├── templates/                 # HTML/CSS 템플릿
│   │   ├── components/           # 컴포넌트 템플릿
│   │   │   ├── cards/
│   │   │   ├── buttons/
│   │   │   ├── navigation/
│   │   │   └── forms/
│   │   └── layouts/              # 레이아웃 템플릿
│   │       ├── landing/
│   │       ├── dashboard/
│   │       └── portfolio/
│   └── utils/                    # 유틸리티 함수
│       ├── color-utils.ts
│       ├── spacing-utils.ts
│       └── responsive-utils.ts
├── dist/                         # 빌드된 파일
└── examples/                     # 사용 예제
    ├── basic-usage.md
    └── advanced-patterns.md
```

## 🛠️ 구현 단계

### Phase 1: 프로젝트 초기화 (Day 1)

#### 1.1 프로젝트 셋업
```bash
# 프로젝트 생성
mkdir figma-to-web-mcp-server
cd figma-to-web-mcp-server

# npm 초기화
npm init -y

# 필수 패키지 설치
npm install @modelcontextprotocol/sdk
npm install -D typescript @types/node
```

#### 1.2 TypeScript 설정
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 1.3 Package.json 설정
```json
{
  "name": "figma-to-web-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsc -w"
  }
}
```

### Phase 2: 핵심 도구 구현 (Day 2-3)

#### 2.1 Component Generator Tool
```typescript
// 컴포넌트 생성 도구
{
  name: "generate-component",
  description: "최신 디자인 트렌드를 적용한 컴포넌트 생성",
  inputSchema: {
    type: "object",
    properties: {
      componentType: {
        type: "string",
        enum: ["card", "button", "hero", "navigation", "form", "footer"]
      },
      style: {
        type: "string",
        enum: ["glassmorphism", "gradient", "neomorphism", "minimal"]
      },
      theme: {
        type: "string",
        enum: ["light", "dark", "auto"]
      },
      customizations: {
        type: "object",
        properties: {
          primaryColor: { type: "string" },
          borderRadius: { type: "string" },
          animation: { type: "boolean" }
        }
      }
    }
  }
}
```

#### 2.2 Figma Converter Tool
```typescript
// Figma 디자인 변환 도구
{
  name: "convert-figma",
  description: "Figma 디자인을 HTML/CSS로 자동 변환",
  inputSchema: {
    type: "object",
    properties: {
      figmaUrl: {
        type: "string",
        description: "Figma 파일 또는 프레임 URL"
      },
      outputFormat: {
        type: "string",
        enum: ["html", "react", "vue"]
      },
      includeAnimations: {
        type: "boolean",
        default: true
      },
      responsive: {
        type: "boolean",
        default: true
      }
    }
  }
}
```

#### 2.3 Design Pattern Applier
```typescript
// 디자인 패턴 적용 도구
{
  name: "apply-design-pattern",
  description: "기존 코드에 디자인 패턴 적용",
  inputSchema: {
    type: "object",
    properties: {
      html: {
        type: "string",
        description: "적용할 HTML 코드"
      },
      pattern: {
        type: "string",
        enum: ["glassmorphism", "gradient-animation", "floating", "parallax"]
      },
      intensity: {
        type: "string",
        enum: ["subtle", "medium", "strong"]
      }
    }
  }
}
```

### Phase 3: 패턴 라이브러리 구축 (Day 4-5)

#### 3.1 Glassmorphism 패턴
```typescript
// src/patterns/glassmorphism.ts
export interface GlassConfig {
  blur: number;
  opacity: number;
  borderOpacity: number;
  shadowStrength: number;
}

export function generateGlassStyles(config: GlassConfig): string {
  return `
    background: rgba(255, 255, 255, ${config.opacity});
    backdrop-filter: blur(${config.blur}px);
    -webkit-backdrop-filter: blur(${config.blur}px);
    border: 1px solid rgba(255, 255, 255, ${config.borderOpacity});
    box-shadow: 0 8px 32px rgba(0, 0, 0, ${config.shadowStrength});
  `;
}
```

#### 3.2 Gradient 애니메이션
```typescript
// src/patterns/gradients.ts
export interface GradientConfig {
  colors: string[];
  direction: number;
  animationDuration: number;
  type: 'linear' | 'radial' | 'conic';
}

export function generateAnimatedGradient(config: GradientConfig): string {
  const gradient = config.colors.join(', ');
  return `
    background: ${config.type}-gradient(${config.direction}deg, ${gradient});
    background-size: 400% 400%;
    animation: gradientShift ${config.animationDuration}s ease infinite;
  `;
}
```

### Phase 4: 템플릿 시스템 (Day 6)

#### 4.1 컴포넌트 템플릿
```typescript
// src/templates/components/cards/glass-card.ts
export const glassCardTemplate = {
  html: `
    <div class="glass-card">
      <div class="card-header">
        <h3 class="card-title">{{title}}</h3>
        <span class="card-badge">{{badge}}</span>
      </div>
      <div class="card-content">
        <p class="card-description">{{description}}</p>
      </div>
      <div class="card-footer">
        <button class="card-button">{{buttonText}}</button>
      </div>
    </div>
  `,
  css: `
    .glass-card {
      padding: 24px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .glass-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
    }
  `
};
```

### Phase 5: 테스트 및 배포 (Day 7)

#### 5.1 Claude Desktop 설정
```json
// Claude Desktop 설정 파일
{
  "mcpServers": {
    "figma-to-web": {
      "command": "node",
      "args": ["C:/path/to/figma-to-web-mcp-server/dist/index.js"],
      "env": {
        "FIGMA_API_KEY": "your-api-key"
      }
    }
  }
}
```

#### 5.2 사용 예제
```javascript
// Claude에서 사용
// "glassmorphism 카드 3개를 가로로 배치해줘"
// "이 Figma 디자인을 React 컴포넌트로 변환해줘: [URL]"
// "원익IPS 브랜드 색상으로 히어로 섹션 만들어줘"
```

## 🎨 포함될 컴포넌트

### UI Components
- **Cards**: Glass, Gradient, Neomorphic, Minimal
- **Buttons**: Primary, Secondary, Ghost, Floating
- **Navigation**: Top bar, Side menu, Tab bar, Breadcrumb
- **Forms**: Input fields, Select boxes, Radio/Checkbox, File upload
- **Modals**: Dialog, Alert, Confirmation, Drawer
- **Tables**: Data grid, Sortable, Filterable, Responsive
- **Charts**: Line, Bar, Pie, Area (with Chart.js)

### Layout Components
- **Hero Sections**: Full-width, Split, Centered, Video background
- **Feature Sections**: Grid, Carousel, Timeline, Comparison
- **Testimonials**: Cards, Slider, Grid, Quote style
- **Pricing Tables**: Basic, Comparison, Toggle (monthly/yearly)
- **Footers**: Simple, Multi-column, Mega footer

### Special Effects
- **Animations**: Fade, Slide, Zoom, Rotate, Bounce
- **Parallax**: Images, Text, Sections
- **Scroll Effects**: Reveal, Progress bar, Sticky elements
- **Hover Effects**: 3D flip, Glow, Shadow, Scale

## 💡 사용 시나리오

### 시나리오 1: 빠른 프로토타이핑
```
개발자: "랜딩 페이지 히어로 섹션 만들어줘"
MCP 서버: [자동으로 glassmorphism 히어로 섹션 생성]
개발자: "버튼을 더 크게 하고 애니메이션 추가해줘"
MCP 서버: [즉시 수정 및 애니메이션 적용]
```

### 시나리오 2: Figma 연동
```
디자이너: "이 Figma 디자인 구현해줘: [URL]"
MCP 서버: [Figma API로 디자인 분석 → HTML/CSS 생성]
디자이너: "반응형으로 만들고 다크모드 추가해줘"
MCP 서버: [미디어 쿼리 및 다크모드 변수 추가]
```

### 시나리오 3: 디자인 시스템 적용
```
PM: "우리 회사 스타일로 대시보드 템플릿 만들어줘"
MCP 서버: [원익IPS 브랜드 가이드 적용한 대시보드 생성]
PM: "차트랑 데이터 테이블도 추가해줘"
MCP 서버: [인터랙티브 차트와 테이블 컴포넌트 추가]
```

## ⚡ 기대 효과

### 개발 속도 향상
- **Before**: 컴포넌트 하나 만드는데 30분~1시간
- **After**: 즉시 생성 및 커스터마이징 (1~2분)
- **효율성**: 10~30배 향상

### 디자인 일관성
- 모든 프로젝트에서 동일한 디자인 시스템 사용
- 브랜드 가이드라인 자동 적용
- 디자인-개발 간극 최소화

### 재사용성
- 한 번 만든 패턴은 모든 프로젝트에서 재사용
- 팀 전체가 동일한 컴포넌트 라이브러리 활용
- 버전 관리 및 업데이트 용이

## 📚 참고 자료

### 공식 문서
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Desktop MCP 설정](https://docs.claude.com/mcp)
- [Figma API Documentation](https://www.figma.com/developers/api)

### 튜토리얼
- [How to Build a Custom MCP Server with TypeScript](https://www.freecodecamp.org/news/how-to-build-a-custom-mcp-server-with-typescript/)
- [Building MCP Servers - Step by Step](https://medium.com/@eugenesh4work/how-to-build-an-mcp-server-fast)

### 디자인 리소스
- [2024-2025 Web Design Trends](https://www.awwwards.com/web-design-trends-2025)
- [Glassmorphism CSS Generator](https://ui.glass/generator/)
- [Gradient Animation Examples](https://codepen.io/collection/gradient-animations)

## 🚦 다음 단계

1. **프로토타입 개발** (1주일)
   - 기본 MCP 서버 구조 구현
   - 핵심 컴포넌트 3-5개 구현
   - Claude Desktop에서 테스트

2. **확장 개발** (2주일)
   - 모든 컴포넌트 템플릿 완성
   - Figma API 연동
   - 디자인 시스템 통합

3. **배포 및 문서화** (3일)
   - npm 패키지 퍼블리싱
   - 사용 가이드 작성
   - 팀 교육 자료 준비

4. **유지보수 및 개선**
   - 사용자 피드백 수집
   - 새로운 디자인 패턴 추가
   - 성능 최적화

---

**준비되셨나요?** 이 계획을 바탕으로 실제 MCP 서버 개발을 시작할 수 있습니다! 🚀
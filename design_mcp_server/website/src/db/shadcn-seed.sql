-- shadcn/ui 컴포넌트 등록

-- 카테고리 추가
INSERT OR IGNORE INTO categories (name, display_name, icon, sort_order) VALUES
('Layout', '레이아웃', '📐', 9),
('Form', '폼', '📝', 10),
('Display', '디스플레이', '🎨', 11),
('Overlay', '오버레이', '🔲', 12),
('Feedback', '피드백', '💬', 13),
('Data', '데이터', '📊', 14);

-- shadcn/ui 컴포넌트 일괄 등록 (주요 컴포넌트만 선별)
INSERT INTO components (name, category, description, html, css, js, props, tags) VALUES

-- Button
('shadcn-button', 'Form', 'shadcn/ui Button - 다양한 스타일의 버튼 컴포넌트',
'<button class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
  Button
</button>',
'.inline-flex { display: inline-flex; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.rounded-md { border-radius: 0.375rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.font-medium { font-weight: 500; }
.h-10 { height: 2.5rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.bg-primary { background-color: hsl(var(--primary)); }
.text-primary-foreground { color: hsl(var(--primary-foreground)); }
.hover\\:bg-primary\\/90:hover { background-color: hsl(var(--primary) / 0.9); }',
'// shadcn/ui Button
// npm install @radix-ui/react-slot
// npx shadcn@latest add button',
'{"framework": "React", "source": "shadcn/ui", "radix": true, "tailwind": true}',
'button,shadcn,radix-ui,react,form'),

-- Card
('shadcn-card', 'Layout', 'shadcn/ui Card - 콘텐츠 카드 컴포넌트',
'<div class="rounded-lg border bg-card text-card-foreground shadow-sm">
  <div class="flex flex-col space-y-1.5 p-6">
    <h3 class="text-2xl font-semibold leading-none tracking-tight">Card Title</h3>
    <p class="text-sm text-muted-foreground">Card Description</p>
  </div>
  <div class="p-6 pt-0">Card Content</div>
  <div class="flex items-center p-6 pt-0">
    <button class="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2">Button</button>
  </div>
</div>',
'.rounded-lg { border-radius: 0.5rem; }
.border { border-width: 1px; }
.bg-card { background-color: hsl(var(--card)); }
.text-card-foreground { color: hsl(var(--card-foreground)); }
.shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.space-y-1\\.5 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.375rem; }
.p-6 { padding: 1.5rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.font-semibold { font-weight: 600; }
.text-muted-foreground { color: hsl(var(--muted-foreground)); }',
'// shadcn/ui Card
// npx shadcn@latest add card',
'{"framework": "React", "source": "shadcn/ui", "tailwind": true}',
'card,shadcn,layout,container,react'),

-- Input
('shadcn-input', 'Form', 'shadcn/ui Input - 텍스트 입력 필드',
'<input type="text" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Enter text...">',
'.flex { display: flex; }
.h-10 { height: 2.5rem; }
.w-full { width: 100%; }
.rounded-md { border-radius: 0.375rem; }
.border { border-width: 1px; }
.border-input { border-color: hsl(var(--input)); }
.bg-background { background-color: hsl(var(--background)); }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.placeholder\\:text-muted-foreground::placeholder { color: hsl(var(--muted-foreground)); }
.focus-visible\\:outline-none:focus-visible { outline: 2px solid transparent; outline-offset: 2px; }
.focus-visible\\:ring-2:focus-visible { box-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); }',
'// shadcn/ui Input
// npx shadcn@latest add input',
'{"framework": "React", "source": "shadcn/ui", "tailwind": true}',
'input,shadcn,form,text,react'),

-- Dialog
('shadcn-dialog', 'Overlay', 'shadcn/ui Dialog - 모달 다이얼로그',
'<div class="fixed inset-0 z-50 bg-black/80" data-state="open">
  <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
    <div class="flex flex-col space-y-1.5 text-center sm:text-left">
      <h2 class="text-lg font-semibold leading-none tracking-tight">Dialog Title</h2>
      <p class="text-sm text-muted-foreground">Dialog description goes here</p>
    </div>
    <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
      <button class="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2">Close</button>
    </div>
  </div>
</div>',
'.fixed { position: fixed; }
.inset-0 { inset: 0px; }
.z-50 { z-index: 50; }
.bg-black\\/80 { background-color: rgb(0 0 0 / 0.8); }
.left-\\[50\\%\\] { left: 50%; }
.top-\\[50\\%\\] { top: 50%; }
.grid { display: grid; }
.w-full { width: 100%; }
.max-w-lg { max-width: 32rem; }
.translate-x-\\[-50\\%\\] { transform: translateX(-50%); }
.translate-y-\\[-50\\%\\] { transform: translateY(-50%); }
.gap-4 { gap: 1rem; }
.border { border-width: 1px; }
.bg-background { background-color: hsl(var(--background)); }
.p-6 { padding: 1.5rem; }
.shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }',
'// shadcn/ui Dialog
// npm install @radix-ui/react-dialog
// npx shadcn@latest add dialog',
'{"framework": "React", "source": "shadcn/ui", "radix": true, "tailwind": true}',
'dialog,modal,shadcn,radix-ui,overlay,react'),

-- Badge
('shadcn-badge', 'Display', 'shadcn/ui Badge - 라벨 배지 컴포넌트',
'<div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
  Badge
</div>',
'.inline-flex { display: inline-flex; }
.items-center { align-items: center; }
.rounded-full { border-radius: 9999px; }
.border { border-width: 1px; }
.px-2\\.5 { padding-left: 0.625rem; padding-right: 0.625rem; }
.py-0\\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.font-semibold { font-weight: 600; }
.border-transparent { border-color: transparent; }
.bg-primary { background-color: hsl(var(--primary)); }
.text-primary-foreground { color: hsl(var(--primary-foreground)); }
.hover\\:bg-primary\\/80:hover { background-color: hsl(var(--primary) / 0.8); }',
'// shadcn/ui Badge
// npx shadcn@latest add badge',
'{"framework": "React", "source": "shadcn/ui", "tailwind": true}',
'badge,label,tag,shadcn,display,react'),

-- Alert
('shadcn-alert', 'Feedback', 'shadcn/ui Alert - 알림 메시지 컴포넌트',
'<div class="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground">
  <h5 class="mb-1 font-medium leading-none tracking-tight">Alert Title</h5>
  <div class="text-sm [&_p]:leading-relaxed">Alert description goes here</div>
</div>',
'.relative { position: relative; }
.w-full { width: 100%; }
.rounded-lg { border-radius: 0.5rem; }
.border { border-width: 1px; }
.p-4 { padding: 1rem; }
.mb-1 { margin-bottom: 0.25rem; }
.font-medium { font-weight: 500; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }',
'// shadcn/ui Alert
// npx shadcn@latest add alert',
'{"framework": "React", "source": "shadcn/ui", "tailwind": true}',
'alert,notification,message,shadcn,feedback,react'),

-- Select
('shadcn-select', 'Form', 'shadcn/ui Select - 선택 상자',
'<button type="button" role="combobox" class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
  <span>Select an option</span>
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-50">
    <path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
  </svg>
</button>',
'.flex { display: flex; }
.h-10 { height: 2.5rem; }
.w-full { width: 100%; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.rounded-md { border-radius: 0.375rem; }
.border { border-width: 1px; }
.border-input { border-color: hsl(var(--input)); }
.bg-background { background-color: hsl(var(--background)); }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }',
'// shadcn/ui Select
// npm install @radix-ui/react-select
// npx shadcn@latest add select',
'{"framework": "React", "source": "shadcn/ui", "radix": true, "tailwind": true}',
'select,dropdown,form,shadcn,radix-ui,react'),

-- Tabs
('shadcn-tabs', 'navigation', 'shadcn/ui Tabs - 탭 네비게이션',
'<div>
  <div class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
    <button class="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background text-foreground shadow-sm">
      Tab 1
    </button>
    <button class="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
      Tab 2
    </button>
  </div>
  <div class="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
    Tab content goes here
  </div>
</div>',
'.inline-flex { display: inline-flex; }
.h-10 { height: 2.5rem; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.rounded-md { border-radius: 0.375rem; }
.bg-muted { background-color: hsl(var(--muted)); }
.p-1 { padding: 0.25rem; }
.text-muted-foreground { color: hsl(var(--muted-foreground)); }
.whitespace-nowrap { white-space: nowrap; }
.rounded-sm { border-radius: 0.125rem; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.py-1\\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.font-medium { font-weight: 500; }
.shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }',
'// shadcn/ui Tabs
// npm install @radix-ui/react-tabs
// npx shadcn@latest add tabs',
'{"framework": "React", "source": "shadcn/ui", "radix": true, "tailwind": true}',
'tabs,navigation,shadcn,radix-ui,react'),

-- Avatar
('shadcn-avatar', 'Display', 'shadcn/ui Avatar - 사용자 아바타',
'<span class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
  <img class="aspect-square h-full w-full" src="/placeholder-avatar.jpg" alt="Avatar">
</span>',
'.relative { position: relative; }
.flex { display: flex; }
.h-10 { height: 2.5rem; }
.w-10 { width: 2.5rem; }
.shrink-0 { flex-shrink: 0; }
.overflow-hidden { overflow: hidden; }
.rounded-full { border-radius: 9999px; }
.aspect-square { aspect-ratio: 1 / 1; }
.h-full { height: 100%; }
.w-full { width: 100%; }',
'// shadcn/ui Avatar
// npm install @radix-ui/react-avatar
// npx shadcn@latest add avatar',
'{"framework": "React", "source": "shadcn/ui", "radix": true, "tailwind": true}',
'avatar,profile,user,image,shadcn,radix-ui,display,react'),

-- Table
('shadcn-table', 'Data', 'shadcn/ui Table - 데이터 테이블',
'<div class="relative w-full overflow-auto">
  <table class="w-full caption-bottom text-sm">
    <thead class="[&_tr]:border-b">
      <tr class="border-b transition-colors hover:bg-muted/50">
        <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Header 1</th>
        <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Header 2</th>
      </tr>
    </thead>
    <tbody class="[&_tr:last-child]:border-0">
      <tr class="border-b transition-colors hover:bg-muted/50">
        <td class="p-4 align-middle">Cell 1</td>
        <td class="p-4 align-middle">Cell 2</td>
      </tr>
    </tbody>
  </table>
</div>',
'.relative { position: relative; }
.w-full { width: 100%; }
.overflow-auto { overflow: auto; }
.caption-bottom { caption-side: bottom; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.border-b { border-bottom-width: 1px; }
.h-12 { height: 3rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.text-left { text-align: left; }
.align-middle { vertical-align: middle; }
.font-medium { font-weight: 500; }
.text-muted-foreground { color: hsl(var(--muted-foreground)); }
.p-4 { padding: 1rem; }
.hover\\:bg-muted\\/50:hover { background-color: hsl(var(--muted) / 0.5); }',
'// shadcn/ui Table
// npx shadcn@latest add table',
'{"framework": "React", "source": "shadcn/ui", "tailwind": true}',
'table,data,grid,shadcn,react');

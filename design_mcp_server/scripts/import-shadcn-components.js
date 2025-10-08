/**
 * shadcn/ui 컴포넌트를 Component Library MCP Server에 일괄 등록
 */

const Database = require('better-sqlite3');
const path = require('path');

// 데이터베이스 연결
const dbPath = path.join(__dirname, '../website/database.db');
const db = new Database(dbPath);

// WAL 모드 활성화
db.pragma('journal_mode = WAL');

// 카테고리 먼저 등록
const categories = [
  { name: 'Layout', display_name: '레이아웃', icon: '📐', sort_order: 1 },
  { name: 'Form', display_name: '폼', icon: '📝', sort_order: 2 },
  { name: 'Display', display_name: '디스플레이', icon: '🎨', sort_order: 3 },
  { name: 'Navigation', display_name: '네비게이션', icon: '🧭', sort_order: 4 },
  { name: 'Overlay', display_name: '오버레이', icon: '🔲', sort_order: 5 },
  { name: 'Feedback', display_name: '피드백', icon: '💬', sort_order: 6 },
  { name: 'Data', display_name: '데이터', icon: '📊', sort_order: 7 }
];

const insertCategory = db.prepare(`
  INSERT OR IGNORE INTO categories (name, display_name, icon, sort_order)
  VALUES (@name, @display_name, @icon, @sort_order)
`);

for (const category of categories) {
  insertCategory.run(category);
}

console.log('✅ 카테고리 등록 완료');

// shadcn/ui 컴포넌트 목록 (New 태그가 있는 컴포넌트 포함)
const shadcnComponents = [
  {
    name: 'Accordion',
    description: '접고 펼칠 수 있는 아코디언 컴포넌트',
    category: 'Layout',
    framework: 'React',
    tags: ['accordion', 'collapse', 'expand', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/accordion',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/accordion.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/accordion'
  },
  {
    name: 'Alert',
    description: '알림 메시지를 표시하는 컴포넌트',
    category: 'Feedback',
    framework: 'React',
    tags: ['alert', 'notification', 'message', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/alert',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/alert.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/alert'
  },
  {
    name: 'Alert Dialog',
    description: '중요한 결정을 요구하는 모달 다이얼로그',
    category: 'Overlay',
    framework: 'React',
    tags: ['dialog', 'modal', 'alert', 'confirmation', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/alert-dialog',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/alert-dialog.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/alert-dialog'
  },
  {
    name: 'Aspect Ratio',
    description: '특정 가로세로 비율을 유지하는 컨테이너',
    category: 'Layout',
    framework: 'React',
    tags: ['aspect-ratio', 'responsive', 'media', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/aspect-ratio',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/aspect-ratio.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/aspect-ratio'
  },
  {
    name: 'Avatar',
    description: '사용자 프로필 이미지 또는 아바타',
    category: 'Display',
    framework: 'React',
    tags: ['avatar', 'profile', 'user', 'image', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/avatar',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/avatar.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/avatar'
  },
  {
    name: 'Badge',
    description: '라벨이나 상태를 표시하는 배지',
    category: 'Display',
    framework: 'React',
    tags: ['badge', 'label', 'tag', 'status', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/badge',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/badge.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/badge'
  },
  {
    name: 'Breadcrumb',
    description: '페이지 경로를 표시하는 네비게이션',
    category: 'Navigation',
    framework: 'React',
    tags: ['breadcrumb', 'navigation', 'path', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/breadcrumb',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/breadcrumb.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/breadcrumb'
  },
  {
    name: 'Button',
    description: '클릭 가능한 버튼 컴포넌트',
    category: 'Form',
    framework: 'React',
    tags: ['button', 'click', 'action', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/button',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/button.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/button'
  },
  {
    name: 'Button Group',
    description: '여러 버튼을 그룹화하는 컴포넌트 (New)',
    category: 'Form',
    framework: 'React',
    tags: ['button', 'group', 'toggle', 'shadcn', 'new'],
    figma_url: 'https://ui.shadcn.com/docs/components/button-group',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/button-group.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/button-group'
  },
  {
    name: 'Calendar',
    description: '날짜를 선택하는 캘린더',
    category: 'Form',
    framework: 'React',
    tags: ['calendar', 'date', 'picker', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/calendar',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/calendar.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/calendar'
  },
  {
    name: 'Card',
    description: '콘텐츠를 담는 카드 컴포넌트',
    category: 'Layout',
    framework: 'React',
    tags: ['card', 'container', 'panel', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/card',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/card.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/card'
  },
  {
    name: 'Carousel',
    description: '이미지나 콘텐츠를 슬라이드하는 캐러셀',
    category: 'Display',
    framework: 'React',
    tags: ['carousel', 'slider', 'gallery', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/carousel',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/carousel.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/carousel'
  },
  {
    name: 'Chart',
    description: '데이터 시각화를 위한 차트 컴포넌트',
    category: 'Data',
    framework: 'React',
    tags: ['chart', 'graph', 'data', 'visualization', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/chart',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/chart.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/chart'
  },
  {
    name: 'Checkbox',
    description: '체크박스 입력 컴포넌트',
    category: 'Form',
    framework: 'React',
    tags: ['checkbox', 'input', 'form', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/checkbox',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/checkbox.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/checkbox'
  },
  {
    name: 'Collapsible',
    description: '접을 수 있는 콘텐츠 영역',
    category: 'Layout',
    framework: 'React',
    tags: ['collapsible', 'collapse', 'expand', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/collapsible',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/collapsible.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/collapsible'
  },
  {
    name: 'Combobox',
    description: '검색 가능한 선택 상자',
    category: 'Form',
    framework: 'React',
    tags: ['combobox', 'autocomplete', 'select', 'search', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/combobox',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/combobox.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/combobox'
  },
  {
    name: 'Command',
    description: '명령어 팔레트 및 검색 인터페이스',
    category: 'Navigation',
    framework: 'React',
    tags: ['command', 'palette', 'search', 'keyboard', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/command',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/command.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/command'
  },
  {
    name: 'Context Menu',
    description: '우클릭 컨텍스트 메뉴',
    category: 'Overlay',
    framework: 'React',
    tags: ['context-menu', 'right-click', 'menu', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/context-menu',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/context-menu.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/context-menu'
  },
  {
    name: 'Data Table',
    description: '정렬, 필터링 가능한 데이터 테이블',
    category: 'Data',
    framework: 'React',
    tags: ['table', 'data', 'grid', 'sort', 'filter', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/data-table',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/data-table.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/data-table'
  },
  {
    name: 'Date Picker',
    description: '날짜 선택 컴포넌트',
    category: 'Form',
    framework: 'React',
    tags: ['date-picker', 'calendar', 'date', 'input', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/date-picker',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/date-picker.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/date-picker'
  },
  {
    name: 'Dialog',
    description: '모달 다이얼로그 컴포넌트',
    category: 'Overlay',
    framework: 'React',
    tags: ['dialog', 'modal', 'popup', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/dialog',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/dialog.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/dialog'
  },
  {
    name: 'Drawer',
    description: '측면에서 열리는 서랍형 패널',
    category: 'Overlay',
    framework: 'React',
    tags: ['drawer', 'sidebar', 'panel', 'slide', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/drawer',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/drawer.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/drawer'
  },
  {
    name: 'Dropdown Menu',
    description: '드롭다운 메뉴 컴포넌트',
    category: 'Overlay',
    framework: 'React',
    tags: ['dropdown', 'menu', 'select', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/dropdown-menu',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/dropdown-menu.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/dropdown-menu'
  },
  {
    name: 'Empty',
    description: '빈 상태를 표시하는 컴포넌트 (New)',
    category: 'Feedback',
    framework: 'React',
    tags: ['empty', 'no-data', 'placeholder', 'shadcn', 'new'],
    figma_url: 'https://ui.shadcn.com/docs/components/empty',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/empty.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/empty'
  },
  {
    name: 'Field',
    description: '폼 필드 래퍼 컴포넌트 (New)',
    category: 'Form',
    framework: 'React',
    tags: ['field', 'form', 'input', 'label', 'shadcn', 'new'],
    figma_url: 'https://ui.shadcn.com/docs/components/field',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/field.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/field'
  },
  {
    name: 'Form (React Hook Form)',
    description: 'React Hook Form 통합 폼 컴포넌트',
    category: 'Form',
    framework: 'React',
    tags: ['form', 'react-hook-form', 'validation', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/form',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/form.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/form'
  },
  {
    name: 'Hover Card',
    description: '호버 시 표시되는 카드',
    category: 'Overlay',
    framework: 'React',
    tags: ['hover-card', 'tooltip', 'popover', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/hover-card',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/hover-card.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/hover-card'
  },
  {
    name: 'Input',
    description: '텍스트 입력 컴포넌트',
    category: 'Form',
    framework: 'React',
    tags: ['input', 'text', 'form', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/input',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/input.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/input'
  },
  {
    name: 'Input Group',
    description: '입력 필드 그룹화 컴포넌트 (New)',
    category: 'Form',
    framework: 'React',
    tags: ['input-group', 'form', 'addon', 'shadcn', 'new'],
    figma_url: 'https://ui.shadcn.com/docs/components/input-group',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/input-group.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/input-group'
  },
  {
    name: 'Input OTP',
    description: 'OTP (일회용 비밀번호) 입력 컴포넌트',
    category: 'Form',
    framework: 'React',
    tags: ['input', 'otp', 'code', 'verification', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/input-otp',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/input-otp.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/input-otp'
  },
  {
    name: 'Item',
    description: '목록 아이템 컴포넌트 (New)',
    category: 'Display',
    framework: 'React',
    tags: ['item', 'list', 'menu-item', 'shadcn', 'new'],
    figma_url: 'https://ui.shadcn.com/docs/components/item',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/item.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/item'
  },
  {
    name: 'Kbd',
    description: '키보드 단축키 표시 컴포넌트 (New)',
    category: 'Display',
    framework: 'React',
    tags: ['kbd', 'keyboard', 'shortcut', 'key', 'shadcn', 'new'],
    figma_url: 'https://ui.shadcn.com/docs/components/kbd',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/kbd.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/kbd'
  },
  {
    name: 'Label',
    description: '폼 라벨 컴포넌트',
    category: 'Form',
    framework: 'React',
    tags: ['label', 'form', 'input', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/label',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/label.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/label'
  },
  {
    name: 'Menubar',
    description: '데스크톱 스타일 메뉴바',
    category: 'Navigation',
    framework: 'React',
    tags: ['menubar', 'menu', 'navigation', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/menubar',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/menubar.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/menubar'
  },
  {
    name: 'Navigation Menu',
    description: '계층적 네비게이션 메뉴',
    category: 'Navigation',
    framework: 'React',
    tags: ['navigation', 'menu', 'nav', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/navigation-menu',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/navigation-menu.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/navigation-menu'
  },
  {
    name: 'Pagination',
    description: '페이지네이션 컴포넌트',
    category: 'Navigation',
    framework: 'React',
    tags: ['pagination', 'pager', 'navigation', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/pagination',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/pagination.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/pagination'
  },
  {
    name: 'Popover',
    description: '팝오버 컴포넌트',
    category: 'Overlay',
    framework: 'React',
    tags: ['popover', 'popup', 'tooltip', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/popover',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/popover.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/popover'
  },
  {
    name: 'Progress',
    description: '진행률 표시 바',
    category: 'Feedback',
    framework: 'React',
    tags: ['progress', 'loading', 'bar', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/progress',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/progress.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/progress'
  },
  {
    name: 'Radio Group',
    description: '라디오 버튼 그룹',
    category: 'Form',
    framework: 'React',
    tags: ['radio', 'input', 'form', 'selection', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/radio-group',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/radio-group.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/radio-group'
  },
  {
    name: 'Resizable',
    description: '크기 조절 가능한 패널',
    category: 'Layout',
    framework: 'React',
    tags: ['resizable', 'split', 'panel', 'resize', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/resizable',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/resizable.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/resizable'
  },
  {
    name: 'Scroll Area',
    description: '커스텀 스크롤바 영역',
    category: 'Layout',
    framework: 'React',
    tags: ['scroll', 'scrollbar', 'overflow', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/scroll-area',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/scroll-area.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/scroll-area'
  },
  {
    name: 'Select',
    description: '선택 상자 컴포넌트',
    category: 'Form',
    framework: 'React',
    tags: ['select', 'dropdown', 'form', 'input', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/select',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/select.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/select'
  },
  {
    name: 'Separator',
    description: '구분선 컴포넌트',
    category: 'Layout',
    framework: 'React',
    tags: ['separator', 'divider', 'line', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/separator',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/separator.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/separator'
  },
  {
    name: 'Sheet',
    description: '측면 패널 컴포넌트',
    category: 'Overlay',
    framework: 'React',
    tags: ['sheet', 'drawer', 'sidebar', 'panel', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/sheet',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/sheet.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/sheet'
  },
  {
    name: 'Sidebar',
    description: '사이드바 레이아웃 컴포넌트',
    category: 'Navigation',
    framework: 'React',
    tags: ['sidebar', 'navigation', 'menu', 'layout', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/sidebar',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/sidebar.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/sidebar'
  },
  {
    name: 'Skeleton',
    description: '로딩 플레이스홀더',
    category: 'Feedback',
    framework: 'React',
    tags: ['skeleton', 'loading', 'placeholder', 'shimmer', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/skeleton',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/skeleton.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/skeleton'
  },
  {
    name: 'Slider',
    description: '슬라이더 입력 컴포넌트',
    category: 'Form',
    framework: 'React',
    tags: ['slider', 'range', 'input', 'form', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/slider',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/slider.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/slider'
  },
  {
    name: 'Sonner',
    description: 'Toast 알림 라이브러리 통합',
    category: 'Feedback',
    framework: 'React',
    tags: ['toast', 'notification', 'sonner', 'alert', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/sonner',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/sonner.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/sonner'
  },
  {
    name: 'Spinner',
    description: '로딩 스피너 컴포넌트 (New)',
    category: 'Feedback',
    framework: 'React',
    tags: ['spinner', 'loading', 'loader', 'shadcn', 'new'],
    figma_url: 'https://ui.shadcn.com/docs/components/spinner',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/spinner.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/spinner'
  },
  {
    name: 'Switch',
    description: '토글 스위치 컴포넌트',
    category: 'Form',
    framework: 'React',
    tags: ['switch', 'toggle', 'checkbox', 'form', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/switch',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/switch.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/switch'
  },
  {
    name: 'Table',
    description: '테이블 컴포넌트',
    category: 'Data',
    framework: 'React',
    tags: ['table', 'grid', 'data', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/table',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/table.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/table'
  },
  {
    name: 'Tabs',
    description: '탭 컴포넌트',
    category: 'Navigation',
    framework: 'React',
    tags: ['tabs', 'tab-panel', 'navigation', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/tabs',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/tabs.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/tabs'
  },
  {
    name: 'Textarea',
    description: '여러 줄 텍스트 입력',
    category: 'Form',
    framework: 'React',
    tags: ['textarea', 'text', 'input', 'form', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/textarea',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/textarea.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/textarea'
  },
  {
    name: 'Toast',
    description: 'Toast 알림 컴포넌트',
    category: 'Feedback',
    framework: 'React',
    tags: ['toast', 'notification', 'alert', 'message', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/toast',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/toast.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/toast'
  },
  {
    name: 'Toggle',
    description: '토글 버튼 컴포넌트',
    category: 'Form',
    framework: 'React',
    tags: ['toggle', 'button', 'switch', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/toggle',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/toggle.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/toggle'
  },
  {
    name: 'Toggle Group',
    description: '토글 버튼 그룹',
    category: 'Form',
    framework: 'React',
    tags: ['toggle', 'button-group', 'radio', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/toggle-group',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/toggle-group.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/toggle-group'
  },
  {
    name: 'Tooltip',
    description: '툴팁 컴포넌트',
    category: 'Overlay',
    framework: 'React',
    tags: ['tooltip', 'hint', 'popover', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/tooltip',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/tooltip.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/tooltip'
  },
  {
    name: 'Typography',
    description: '타이포그래피 스타일 컴포넌트',
    category: 'Display',
    framework: 'React',
    tags: ['typography', 'text', 'heading', 'paragraph', 'shadcn'],
    figma_url: 'https://ui.shadcn.com/docs/components/typography',
    code_url: 'https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/typography.tsx',
    preview_url: 'https://ui.shadcn.com/docs/components/typography'
  }
];

// 컴포넌트 삽입 (스키마에 맞게 수정)
const insertComponent = db.prepare(`
  INSERT INTO components (name, description, category, tags, html, css, js, props)
  VALUES (@name, @description, @category, @tags, @html, @css, @js, @props)
`);

const insertMany = db.transaction((components) => {
  for (const component of components) {
    insertComponent.run({
      name: component.name,
      description: component.description,
      category: component.category,
      tags: component.tags.join(','),
      html: `<!-- shadcn/ui ${component.name} Component -->
<div class="shadcn-${component.name.toLowerCase().replace(/\s+/g, '-')}">
  <p>shadcn/ui 컴포넌트입니다. 자세한 내용은 <a href="${component.preview_url}" target="_blank">공식 문서</a>를 참조하세요.</p>
  <p>설치: <code>npx shadcn@latest add ${component.name.toLowerCase().replace(/\s+/g, '-')}</code></p>
</div>`,
      css: `/* shadcn/ui ${component.name} Component */
/* See: ${component.preview_url} */
.shadcn-${component.name.toLowerCase().replace(/\s+/g, '-')} {
  /* shadcn/ui 공식 스타일 적용 */
}`,
      js: component.code_url ? `// ${component.name} Component
// Source: ${component.code_url}
// Preview: ${component.preview_url}` : '',
      props: JSON.stringify({
        framework: component.framework,
        source: 'shadcn/ui',
        documentation: component.preview_url,
        codeUrl: component.code_url,
        figmaUrl: component.figma_url
      })
    });
  }
});

try {
  // 트랜잭션으로 일괄 삽입
  insertMany(shadcnComponents);

  console.log(`✅ ${shadcnComponents.length}개의 shadcn/ui 컴포넌트가 성공적으로 등록되었습니다!`);

  // 등록 결과 확인
  const count = db.prepare('SELECT COUNT(*) as count FROM components WHERE tags LIKE ?').get('%shadcn%');
  console.log(`📊 현재 데이터베이스에 등록된 shadcn/ui 컴포넌트: ${count.count}개`);

} catch (error) {
  console.error('❌ 컴포넌트 등록 중 오류 발생:', error);
  process.exit(1);
} finally {
  db.close();
}

#!/usr/bin/env node
/**
 * Database Seed Script
 * Populates database with sample components, variants, and design systems
 */

import { withConnection } from './connection.js';

console.log('🌱 Seeding database with sample data...\n');

// Sample categories
const categories = [
  { name: 'buttons', display_name: 'Buttons', icon: '🔘', sort_order: 1 },
  { name: 'cards', display_name: 'Cards', icon: '🎴', sort_order: 2 },
  { name: 'forms', display_name: 'Forms', icon: '📝', sort_order: 3 },
  { name: 'navigation', display_name: 'Navigation', icon: '🧭', sort_order: 4 },
  { name: 'modals', display_name: 'Modals', icon: '🪟', sort_order: 5 },
  { name: 'tables', display_name: 'Tables', icon: '📊', sort_order: 6 },
  { name: 'layouts', display_name: 'Layouts', icon: '📐', sort_order: 7 },
  { name: 'feedback', display_name: 'Feedback', icon: '💬', sort_order: 8 }
];

// Sample components
const components = [
  // BUTTONS
  {
    name: 'GlassButton',
    category: 'buttons',
    description: 'Modern glassmorphism button with blur effect',
    html: '<button class="glass-btn {{variant}}">{{text}}</button>',
    css: `.glass-btn {
  padding: 12px 24px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #333;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.glass-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}`,
    js: '',
    props: JSON.stringify({ text: 'Click Me', variant: 'primary' }),
    tags: 'glass,modern,blur,button'
  },
  {
    name: 'GradientButton',
    category: 'buttons',
    description: 'Vibrant gradient button with hover animation',
    html: '<button class="gradient-btn {{variant}}">{{text}}</button>',
    css: `.gradient-btn {
  padding: 12px 32px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  background-size: 200% auto;
}
.gradient-btn:hover {
  background-position: right center;
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}`,
    js: '',
    props: JSON.stringify({ text: 'Get Started', variant: 'primary' }),
    tags: 'gradient,colorful,animated,button'
  },
  {
    name: 'NeumorphButton',
    category: 'buttons',
    description: 'Soft UI neomorphism button',
    html: '<button class="neomorph-btn {{variant}}">{{text}}</button>',
    css: `.neomorph-btn {
  padding: 12px 28px;
  border-radius: 16px;
  background: #e0e5ec;
  border: none;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 9px 9px 16px #a3b1c6, -9px -9px 16px #ffffff;
  transition: all 0.3s ease;
}
.neomorph-btn:hover {
  box-shadow: 6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff;
}
.neomorph-btn:active {
  box-shadow: inset 4px 4px 8px #a3b1c6, inset -4px -4px 8px #ffffff;
}`,
    js: '',
    props: JSON.stringify({ text: 'Submit', variant: 'default' }),
    tags: 'neomorphism,soft,3d,button'
  },

  // CARDS
  {
    name: 'GlassCard',
    category: 'cards',
    description: 'Glassmorphism card with modern design',
    html: `<div class="glass-card">
  <h3 class="card-title">{{title}}</h3>
  <p class="card-content">{{content}}</p>
</div>`,
    css: `.glass-card {
  padding: 24px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  transition: all 0.3s ease;
}
.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.5);
}
.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #333;
}
.card-content {
  color: #666;
  line-height: 1.6;
}`,
    js: '',
    props: JSON.stringify({ title: 'Card Title', content: 'Beautiful glassmorphism card with blur effect and smooth animations.' }),
    tags: 'glass,card,modern,blur'
  },
  {
    name: 'ProductCard',
    category: 'cards',
    description: 'E-commerce product card with image',
    html: `<div class="product-card">
  <div class="product-image">
    <div class="image-placeholder">📦</div>
  </div>
  <div class="product-info">
    <h4 class="product-title">{{title}}</h4>
    <p class="product-price">{{price}}</p>
    <button class="product-btn">Add to Cart</button>
  </div>
</div>`,
    css: `.product-card {
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}
.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}
.product-image {
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-placeholder {
  font-size: 4rem;
}
.product-info {
  padding: 20px;
}
.product-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
}
.product-price {
  font-size: 1.5rem;
  font-weight: 800;
  color: #667eea;
  margin-bottom: 16px;
}
.product-btn {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  background: #667eea;
  color: white;
  border: none;
  font-weight: 600;
  cursor: pointer;
}`,
    js: '',
    props: JSON.stringify({ title: 'Product Name', price: '$99.99' }),
    tags: 'product,ecommerce,card,shop'
  },

  // FORMS
  {
    name: 'ModernInput',
    category: 'forms',
    description: 'Modern input field with floating label',
    html: `<div class="input-wrapper">
  <input type="text" id="{{id}}" class="modern-input" placeholder=" " />
  <label for="{{id}}" class="input-label">{{label}}</label>
</div>`,
    css: `.input-wrapper {
  position: relative;
  margin: 16px 0;
}
.modern-input {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}
.modern-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}
.input-label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 0 4px;
  color: #999;
  transition: all 0.3s ease;
  pointer-events: none;
}
.modern-input:focus + .input-label,
.modern-input:not(:placeholder-shown) + .input-label {
  top: 0;
  font-size: 0.75rem;
  color: #667eea;
}`,
    js: '',
    props: JSON.stringify({ id: 'email', label: 'Email Address' }),
    tags: 'input,form,floating,label'
  },

  // NAVIGATION
  {
    name: 'GlassNavbar',
    category: 'navigation',
    description: 'Glassmorphism navigation bar',
    html: `<nav class="glass-navbar">
  <div class="nav-container">
    <div class="nav-logo">{{logo}}</div>
    <div class="nav-links">
      <a href="#" class="nav-link">Home</a>
      <a href="#" class="nav-link">About</a>
      <a href="#" class="nav-link">Contact</a>
    </div>
  </div>
</nav>`,
    css: `.glass-navbar {
  position: sticky;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
}
.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nav-logo {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.nav-links {
  display: flex;
  gap: 32px;
}
.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}
.nav-link:hover {
  color: #667eea;
}`,
    js: '',
    props: JSON.stringify({ logo: '✨ Brand' }),
    tags: 'navbar,navigation,glass,header'
  }
];

// Sample variants for buttons
const variants = [
  // GlassButton variants
  { component_name: 'GlassButton', name: 'primary', description: 'Primary style', css_overrides: '.glass-btn { background: rgba(102, 126, 234, 0.2); color: #667eea; }' },
  { component_name: 'GlassButton', name: 'secondary', description: 'Secondary style', css_overrides: '.glass-btn { background: rgba(118, 75, 162, 0.2); color: #764ba2; }' },
  { component_name: 'GlassButton', name: 'ghost', description: 'Ghost style', css_overrides: '.glass-btn { background: transparent; border: 2px solid rgba(102, 126, 234, 0.5); }' },

  // GradientButton variants
  { component_name: 'GradientButton', name: 'purple', description: 'Purple gradient', css_overrides: '.gradient-btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }' },
  { component_name: 'GradientButton', name: 'pink', description: 'Pink gradient', css_overrides: '.gradient-btn { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }' },
  { component_name: 'GradientButton', name: 'blue', description: 'Blue gradient', css_overrides: '.gradient-btn { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }' }
];

// Default design system
const defaultDesignSystem = {
  name: 'Default Theme',
  description: 'Default TailwindCSS-inspired design system',
  colors: JSON.stringify({
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb',
    neutral: '#2d3748'
  }),
  typography: JSON.stringify({
    fontFamily: "'Inter', sans-serif",
    fontSize: { base: '16px', scale: 1.25 }
  }),
  spacing: JSON.stringify({
    unit: '4px',
    scale: [0.25, 0.5, 1, 2, 3, 4, 6, 8, 12, 16]
  }),
  css_variables: `:root {
  --color-primary: #667eea;
  --color-secondary: #764ba2;
  --color-accent: #f093fb;
  --color-neutral: #2d3748;
}`,
  is_active: 1
};

try {
  withConnection((db) => {
    // Insert categories
    console.log('📁 Inserting categories...');
    const insertCategory = db.prepare(`
      INSERT INTO categories (name, display_name, icon, sort_order)
      VALUES (@name, @display_name, @icon, @sort_order)
    `);

    categories.forEach(category => {
      insertCategory.run(category);
    });
    console.log(`✓ Inserted ${categories.length} categories\n`);

    // Insert components
    console.log('🎨 Inserting components...');
    const insertComponent = db.prepare(`
      INSERT INTO components (name, category, description, html, css, js, props, tags)
      VALUES (@name, @category, @description, @html, @css, @js, @props, @tags)
    `);

    components.forEach(component => {
      insertComponent.run(component);
    });
    console.log(`✓ Inserted ${components.length} components\n`);

    // Insert variants
    console.log('🎭 Inserting variants...');
    const insertVariant = db.prepare(`
      INSERT INTO variants (component_id, name, description, css_overrides)
      SELECT id, @name, @description, @css_overrides
      FROM components WHERE name = @component_name
    `);

    variants.forEach(variant => {
      insertVariant.run(variant);
    });
    console.log(`✓ Inserted ${variants.length} variants\n`);

    // Insert default design system
    console.log('🎨 Inserting default design system...');
    const insertDesignSystem = db.prepare(`
      INSERT INTO design_systems (name, description, colors, typography, spacing, css_variables, is_active)
      VALUES (@name, @description, @colors, @typography, @spacing, @css_variables, @is_active)
    `);

    insertDesignSystem.run(defaultDesignSystem);
    console.log('✓ Inserted default design system\n');

    console.log('✅ Database seeded successfully!\n');

    // Display stats
    const stats = {
      categories: db.prepare('SELECT COUNT(*) as count FROM categories').get().count,
      components: db.prepare('SELECT COUNT(*) as count FROM components').get().count,
      variants: db.prepare('SELECT COUNT(*) as count FROM variants').get().count,
      design_systems: db.prepare('SELECT COUNT(*) as count FROM design_systems').get().count
    };

    console.log('📊 Seeded Data:');
    console.log(`   Categories: ${stats.categories}`);
    console.log(`   Components: ${stats.components}`);
    console.log(`   Variants: ${stats.variants}`);
    console.log(`   Design Systems: ${stats.design_systems}`);

    console.log('\n💡 Next step:');
    console.log('   Start dev server: npm run dev');
  });
} catch (error) {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
}

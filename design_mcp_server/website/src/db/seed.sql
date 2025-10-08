-- Seed data for Component Library

-- Insert categories
INSERT INTO categories (name, display_name, icon, sort_order) VALUES
('buttons', 'Buttons', '🔘', 1),
('forms', 'Forms', '📝', 2),
('cards', 'Cards', '🎴', 3),
('navigation', 'Navigation', '🧭', 4),
('modals', 'Modals', '📱', 5),
('tables', 'Tables', '📊', 6),
('charts', 'Charts', '📈', 7),
('layouts', 'Layouts', '📐', 8);

-- Insert sample components
-- Modern Glassmorphism Button
INSERT INTO components (name, category, description, html, css, js, props, tags) VALUES
('glassmorphism-button', 'buttons', 'Modern glassmorphism button with gradient and blur effects',
'<button class="glass-btn">
  <span class="btn-content">Click Me</span>
  <span class="btn-glow"></span>
</button>',
'.glass-btn {
  position: relative;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(103, 126, 234, 0.5);
  border-color: rgba(255, 255, 255, 0.5);
}

.glass-btn:active {
  transform: translateY(0);
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.glass-btn:hover .btn-glow {
  left: 100%;
}

.btn-content {
  position: relative;
  z-index: 1;
}',
'',
'{"variant": "primary", "size": "medium"}',
'glassmorphism,modern,2024,gradient,blur');

-- Gradient Card with Floating Animation
INSERT INTO components (name, category, description, html, css, js, props, tags) VALUES
('floating-gradient-card', 'cards', 'Card with gradient background and floating animation',
'<div class="gradient-card">
  <div class="card-shine"></div>
  <h3 class="card-title">Gradient Card</h3>
  <p class="card-text">Beautiful card with gradient background and smooth animations</p>
  <button class="card-btn">Learn More</button>
</div>',
'.gradient-card {
  position: relative;
  width: 320px;
  padding: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.5);
  overflow: hidden;
  animation: floating 3s ease-in-out infinite;
}

@keyframes floating {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.card-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
}

.card-title {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 700;
  color: white;
  position: relative;
  z-index: 1;
}

.card-text {
  margin: 0 0 24px 0;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

.card-btn {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s;
  position: relative;
  z-index: 1;
}

.card-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}',
'',
'{"color": "purple"}',
'card,gradient,floating,animation,modern');

-- Neumorphic Input Field
INSERT INTO components (name, category, description, html, css, js, props, tags) VALUES
('neumorphic-input', 'forms', 'Neumorphic style input field with smooth focus effect',
'<div class="input-container">
  <input type="text" class="neuro-input" placeholder="Enter text...">
  <label class="input-label">Username</label>
</div>',
'.input-container {
  position: relative;
  width: 100%;
  max-width: 320px;
}

.neuro-input {
  width: 100%;
  padding: 16px 20px;
  font-size: 16px;
  color: #333;
  background: #e0e5ec;
  border: none;
  border-radius: 12px;
  box-shadow:
    inset 6px 6px 12px #b8bdc4,
    inset -6px -6px 12px #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

.neuro-input:focus {
  box-shadow:
    inset 4px 4px 8px #b8bdc4,
    inset -4px -4px 8px #ffffff,
    0 0 0 3px rgba(102, 126, 234, 0.3);
}

.neuro-input::placeholder {
  color: #a0a0a0;
}

.input-label {
  position: absolute;
  top: -8px;
  left: 16px;
  padding: 0 8px;
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
  background: #e0e5ec;
}',
'',
'{"type": "text"}',
'neumorphism,input,form,modern');

-- Modern Navigation Bar
INSERT INTO components (name, category, description, html, css, js, props, tags) VALUES
('glass-navbar', 'navigation', 'Glassmorphic navigation bar with blur effect',
'<nav class="glass-nav">
  <div class="nav-logo">Logo</div>
  <ul class="nav-menu">
    <li class="nav-item"><a href="#" class="nav-link active">Home</a></li>
    <li class="nav-item"><a href="#" class="nav-link">About</a></li>
    <li class="nav-item"><a href="#" class="nav-link">Services</a></li>
    <li class="nav-item"><a href="#" class="nav-link">Contact</a></li>
  </ul>
</nav>',
'.glass-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 48px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
}

.nav-logo {
  font-size: 24px;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-menu {
  display: flex;
  gap: 32px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s;
  position: relative;
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  color: white;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  transition: all 0.3s;
  transform: translateX(-50%);
}

.nav-link:hover::after {
  width: 80%;
}',
'',
'{"position": "sticky"}',
'navigation,glassmorphism,navbar,modern');

-- Modern Modal Dialog
INSERT INTO components (name, category, description, html, css, js, props, tags) VALUES
('gradient-modal', 'modals', 'Modern modal with gradient border and backdrop blur',
'<div class="modal-overlay">
  <div class="gradient-modal">
    <button class="modal-close">&times;</button>
    <h2 class="modal-title">Modal Title</h2>
    <p class="modal-content">This is a modern modal with gradient effects and smooth animations.</p>
    <div class="modal-actions">
      <button class="modal-btn cancel">Cancel</button>
      <button class="modal-btn confirm">Confirm</button>
    </div>
  </div>
</div>',
'.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.gradient-modal {
  position: relative;
  width: 90%;
  max-width: 480px;
  padding: 32px;
  background: white;
  border-radius: 20px;
  border: 2px solid transparent;
  background-clip: padding-box;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.gradient-modal::before {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  z-index: -1;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: rotate(90deg);
}

.modal-title {
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.modal-content {
  margin: 0 0 24px 0;
  color: #666;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.modal-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.modal-btn.cancel {
  background: #f0f0f0;
  color: #666;
}

.modal-btn.cancel:hover {
  background: #e0e0e0;
}

.modal-btn.confirm {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.modal-btn.confirm:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transform: translateY(-2px);
}',
'document.querySelector(".modal-close").addEventListener("click", () => {
  document.querySelector(".modal-overlay").style.display = "none";
});

document.querySelector(".modal-btn.cancel").addEventListener("click", () => {
  document.querySelector(".modal-overlay").style.display = "none";
});',
'{"closable": true}',
'modal,dialog,gradient,modern,popup');

-- Insert default design system
INSERT INTO design_systems (name, description, colors, typography, spacing, borders, shadows, breakpoints, is_active) VALUES
('Modern Purple', 'Modern design system with purple gradient theme',
'{"primary": "#667eea", "secondary": "#764ba2", "accent": "#4facfe", "background": "#f5f7fa", "text": "#333333"}',
'{"fontFamily": "Inter, system-ui, sans-serif", "fontSize": {"sm": "14px", "base": "16px", "lg": "18px", "xl": "24px"}}',
'{"xs": "4px", "sm": "8px", "md": "16px", "lg": "24px", "xl": "32px"}',
'{"radius": {"sm": "8px", "md": "12px", "lg": "16px", "xl": "20px"}}',
'{"sm": "0 2px 8px rgba(0,0,0,0.1)", "md": "0 8px 24px rgba(0,0,0,0.15)", "lg": "0 20px 60px rgba(0,0,0,0.2)"}',
'{"sm": "640px", "md": "768px", "lg": "1024px", "xl": "1280px"}',
1);

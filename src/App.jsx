import { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { ShoppingCart, PackageSearch, LayoutDashboard } from 'lucide-react';
import POS from './pages/POS';
import Inventory from './pages/Inventory';

function App() {
  const [isDark, setIsDark] = useState(() => {
    // Persist preference across reloads
    const saved = localStorage.getItem('pos-theme');
    return saved ? saved === 'dark' : true; // default: dark
  });

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pos-theme', theme);
  }, [isDark]);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="flex items-center gap-4" style={{ marginBottom: '2rem' }}>
          <div className="btn-icon" style={{ background: 'var(--accent-primary)', color: 'white', border: 'none' }}>
            <ShoppingCart size={24} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', letterSpacing: '0.5px' }}>QuickPOS</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Point of Sale</span>
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <PackageSearch size={20} />
            <span>Inventory</span>
          </NavLink>
        </nav>

        {/* Dark / Light Mode Toggle */}
        <label className="theme-toggle-wrap" htmlFor="theme-toggle" title="Toggle dark / light mode">
          <span className="theme-toggle-label">
            {isDark ? '🌙' : '☀️'}
            <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
          </span>
          <span className="theme-toggle-switch">
            <input
              id="theme-toggle"
              type="checkbox"
              checked={!isDark}
              onChange={() => setIsDark(prev => !prev)}
            />
            <span className="theme-toggle-slider" />
          </span>
        </label>

        <div style={{ marginTop: '0.75rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          <p>Cashier: <b>Admin</b></p>
          <p>{new Date().toLocaleDateString()}</p>
        </div>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<POS />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

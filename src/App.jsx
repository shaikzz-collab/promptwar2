import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LogOut, Moon, Sun, Vote, Wifi } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ElectionView from './pages/ElectionView';
import Leaderboard from './pages/Leaderboard';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import AssistantWidget from './components/AssistantWidget';

/* ── Canvas Particle Background ── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['rgba(249,115,22,', 'rgba(30,58,138,', 'rgba(22,163,74,'];
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
      });
      // Draw connecting lines between nearby particles
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(149,149,149,${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

/* ── Floating Orbs ── */
function OrbBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-20%', left: '-15%', width: '70vw', height: '70vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.55) 0%, rgba(249,115,22,0.15) 40%, transparent 70%)', animation: 'orbDrift1 18s ease-in-out infinite', filter: 'blur(40px)' }}/>
      <div style={{ position: 'absolute', top: '-5%', right: '-20%', width: '65vw', height: '65vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,58,138,0.5) 0%, rgba(30,58,138,0.12) 40%, transparent 70%)', animation: 'orbDrift2 22s ease-in-out infinite', filter: 'blur(50px)' }}/>
      <div style={{ position: 'absolute', bottom: '-15%', left: '25%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.45) 0%, rgba(22,163,74,0.1) 40%, transparent 70%)', animation: 'orbDrift3 26s ease-in-out infinite', filter: 'blur(45px)' }}/>
      <div style={{ position: 'absolute', top: '50%', left: '-10%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.3) 0%, transparent 70%)', animation: 'orbDrift2 30s ease-in-out infinite reverse', filter: 'blur(35px)' }}/>
    </div>
  );
}

/* ── Live Ticker ── */
function LiveTicker() {
  const items = ['🗳️ Lok Sabha: LIVE VOTING IN PROGRESS', '📊 Leaderboard updating every 5 seconds', '🔐 All votes are end-to-end verified', '🌍 VoteSphere – Trusted by 1M+ voters', '⚡ Real-time results powered by VoteSphere'];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 3500);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ background: 'linear-gradient(90deg, #f97316, #1e3a8a)', padding: '0.4rem 0', overflow: 'hidden', position: 'relative', zIndex: 99 }}>
      <AnimatePresence mode="wait">
        <motion.p key={idx}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          style={{ textAlign: 'center', color: 'white', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em', margin: 0 }}
        >
          <Wifi size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
          {items[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* ── Page Transition Wrapper ── */
function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}


function Navbar({ toggleTheme, isDark }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <Vote className="text-primary" size={32} color="var(--saffron)" />
          <span className="text-2xl font-bold gradient-text">VoteSphere</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
          <Link to="/analytics" className="nav-link">Analytics</Link>
          
          <button onClick={toggleTheme} className="btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div className="flex items-center gap-4 ml-4" style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
              <Link to="/profile" className="flex items-center gap-2 text-muted" style={{ textDecoration: 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--saffron), var(--navy))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700 }}>
                  {user.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)}
                </div>
                {user.name}
              </Link>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2 ml-4" style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function AppRoutes({ toggleTheme, isDark }) {
  const location = useLocation();
  return (
    <>
      <OrbBackground />
      <ParticleCanvas />
      <LiveTicker />
      <Navbar toggleTheme={toggleTheme} isDark={isDark} />
      <main className="container" style={{ minHeight: 'calc(100vh - 160px)', paddingTop: '2.5rem', paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/"            element={<PageWrapper><Dashboard    /></PageWrapper>} />
            <Route path="/login"       element={<PageWrapper><Login        /></PageWrapper>} />
            <Route path="/register"    element={<PageWrapper><Register     /></PageWrapper>} />
            <Route path="/election/:id" element={<PageWrapper><ElectionView /></PageWrapper>} />
            <Route path="/leaderboard" element={<PageWrapper><Leaderboard  /></PageWrapper>} />
            <Route path="/analytics"   element={<PageWrapper><Analytics    /></PageWrapper>} />
            <Route path="/profile"     element={<PageWrapper><Profile      /></PageWrapper>} />
            <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
      <footer style={{ borderTop: '1px solid var(--border-color)', position: 'relative', zIndex: 1, padding: '1.5rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>© {new Date().getFullYear()} VoteSphere — Smart Election Platform</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['🔐 Secure', '⚡ Real-time', '🌍 Global'].map(tag => (
              <span key={tag} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{tag}</span>
            ))}
          </div>
        </div>
      </footer>
      <AssistantWidget />
    </>
  );
}

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.body.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.body.classList.toggle('dark');
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes toggleTheme={toggleTheme} isDark={isDark} />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

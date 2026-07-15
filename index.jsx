import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './useTheme.js';
import { saveLogin, getLogin, registerUser, loginUser } from './localData.js';

// Custom Hook to drive real-time frame animations without CSS files
const useLiveFrameAnimation = () => {
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    let animationFrameId;
    
    const updateLoop = (time) => {
      // Creates a smooth, infinite wave oscillation using sine math
      const waveValue = Math.sin(time / 800) * 12; // Moves up/down by 12px
      setOffset(waveValue);
      animationFrameId = requestAnimationFrame(updateLoop);
    };
    
    animationFrameId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return offset;
};

const IndexPortal = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  // Driving the real-time card float coordinate engine
  const yOffset = useLiveFrameAnimation();

  // Module 1 (Day-45): Auto-navigate if session exists
  useEffect(() => {
    const loggedInUser = getLogin();
    if (loggedInUser && loggedInUser.role) {
      navigate(loggedInUser.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [navigate]);

  // Student States
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [isStudentRegister, setIsStudentRegister] = useState(false);

  // Admin States
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminRegister, setIsAdminRegister] = useState(false);

  // UI Status Alerts
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const scrollContainerRef = useRef(null);

  // Smooth Scroll Controller
  const scrollToPanel = (panelIndex) => {
    setError('');
    setSuccess('');
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: panelIndex * scrollContainerRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleAuth = (e, type, isRegister) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const name = type === 'admin' ? adminName : studentName;
    const email = type === 'admin' ? adminEmail : studentEmail;
    const password = type === 'admin' ? adminPassword : studentPassword;

    if (isRegister && !name.trim()) {
      return setError('Please enter your full name.');
    }
    if (!email.trim() || !password.trim()) {
      return setError('Please fill in all secure authentication inputs.');
    }

    setSubmitting(true);

    if (isRegister) {
      const result = registerUser({ name, email, password, role: type });
      if (!result.success) {
        setError(result.message);
      } else {
        setSuccess('✅ Registered! You can now sign in.');
        if (type === 'admin') setIsAdminRegister(false);
        else setIsStudentRegister(false);
      }
    } else {
      const result = loginUser(email, password);
      if (!result.success) {
        setError(result.message);
      } else {
        const user = result.user;
        saveLogin({ email: user.email, name: user.name, role: user.role });
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userRole', user.role);
        navigate(user.role === 'admin' ? '/admin' : '/dashboard');
      }
    }
    setSubmitting(false);
  };

  return (
    <div style={styles.viewWindow}>
      <button onClick={toggleTheme} style={styles.themeToggle}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div style={styles.scrollWrapper} ref={scrollContainerRef}>
        
        {/* ================= PANEL 1: STUDENT PORTAL ================= */}
        <div style={styles.panelPageLight}>
          <div 
            style={{ 
              ...styles.card,
              // Direct JavaScript injection enforces floating animation instantly
              transform: `translateY(${yOffset}px)`,
              boxShadow: `0 ${20 + yOffset}px 30px rgba(16, 185, 129, 0.15)`
            }}
          >
            <div style={styles.header}>
              <h2 style={{ color: '#1f2937', margin: '0 0 5px 0' }}>Student Portal</h2>
              <div style={styles.liveIndicatorContainer}>
                <span style={styles.liveDotGreen}></span>
                <p style={{ color: '#6b7280', fontSize: '11px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Terminal Online</p>
              </div>
            </div>

            {error && !isAdminRegister && <div style={styles.errorAlert}>⚠️ {error}</div>}
            {success && !isAdminRegister && <div style={styles.successAlert}>{success}</div>}

            <form onSubmit={(e) => handleAuth(e, 'student', isStudentRegister)} style={styles.form}>
              {isStudentRegister && (
                <div style={styles.inputGroup}>
                  <label style={styles.labelLight}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Jane Doe" 
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    required 
                    style={styles.lightInput}
                  />
                </div>
              )}
              <div style={styles.inputGroup}>
                <label style={styles.labelLight}>Student Email</label>
                <input 
                  type="email" 
                  placeholder="student@university.com" 
                  value={studentEmail}
                  onChange={e => setStudentEmail(e.target.value)}
                  required 
                  style={styles.lightInput}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.labelLight}>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={studentPassword}
                  onChange={e => setStudentPassword(e.target.value)}
                  required 
                  style={styles.lightInput}
                />
              </div>

              <button type="submit" disabled={submitting} style={{ ...styles.studentBtn, opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Authenticating...' : (isStudentRegister ? 'Register Profile' : 'Secure Student Sign In')}
              </button>

              <div style={styles.toggleRow}>
                <span onClick={() => { setIsStudentRegister(!isStudentRegister); setError(''); setSuccess(''); }} style={styles.linkLight}>
                  {isStudentRegister ? 'Already have an account? Sign In' : 'New student? Register Here'}
                </span>
              </div>
            </form>

            <div style={styles.switchTerminalBox}>
              <p style={{ fontSize: '13px', color: '#4b5563', margin: '0 0 8px 0' }}>Need administrative tools?</p>
              <button type="button" onClick={() => scrollToPanel(1)} style={styles.slideNextBtn}>
                Slide to Admin Console ➔
              </button>
            </div>
          </div>
        </div>

        {/* ================= PANEL 2: ADMIN SYSTEM CONSOLE ================= */}
        <div style={styles.panelPageDark}>
          <div 
            style={{ 
              ...styles.card, 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              // Dynamic displacement out of step with the student console
              transform: `translateY(${-yOffset}px)`, 
              boxShadow: `0 ${25 - yOffset}px 40px rgba(79, 70, 229, 0.3)`
            }}
          >
            <div style={styles.header}>
              <h2 style={{ color: '#f9fafb', margin: '0 0 5px 0' }}>Admin Console</h2>
              <div style={styles.liveIndicatorContainer}>
                <span style={styles.liveDotBlue}></span>
                <p style={{ color: '#9ca3af', fontSize: '11px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Infrastructure Nodes Active</p>
              </div>
            </div>

            {error && isAdminRegister && <div style={styles.errorAlert}>⚠️ {error}</div>}
            {success && isAdminRegister && <div style={styles.successAlert}>{success}</div>}

            <form onSubmit={(e) => handleAuth(e, 'admin', isAdminRegister)} style={styles.form}>
              {isAdminRegister && (
                <div style={styles.inputGroup}>
                  <label style={styles.labelDark}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Admin Name" 
                    value={adminName}
                    onChange={e => setAdminName(e.target.value)}
                    required 
                    style={styles.darkInput}
                  />
                </div>
              )}
              <div style={styles.inputGroup}>
                <label style={styles.labelDark}>Admin Email</label>
                <input 
                  type="email" 
                  placeholder="admin@university.com" 
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  required 
                  style={styles.darkInput}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.labelDark}>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  required 
                  style={styles.darkInput}
                />
              </div>

              <button type="submit" disabled={submitting} style={{ ...styles.adminBtn, opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Deploying...' : (isAdminRegister ? 'Deploy New Admin' : 'Secure Admin Login')}
              </button>

              <div style={styles.toggleRow}>
                <span onClick={() => { setIsAdminRegister(!isAdminRegister); setError(''); setSuccess(''); }} style={styles.linkDark}>
                  {isAdminRegister ? 'Cancel Registration' : 'New Admin? Register Profile'}
                </span>
              </div>
            </form>

            <div style={{ ...styles.switchTerminalBox, borderTop: '1px solid #374151' }}>
              <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 8px 0' }}>Are you a test taker?</p>
              <button type="button" onClick={() => scrollToPanel(0)} style={styles.slidePrevBtn}>
                ◀ Return to Student Portal
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  viewWindow: { width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', fontFamily: 'sans-serif' },
  scrollWrapper: { display: 'flex', width: '100%', height: '100%', overflowX: 'hidden', scrollSnapType: 'x mandatory' },
  panelPageLight: { minWidth: '100vw', height: '100vh', backgroundColor: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'center', scrollSnapAlign: 'start' },
  panelPageDark: { minWidth: '100vw', height: '100vh', backgroundColor: '#111827', display: 'flex', justifyContent: 'center', alignItems: 'center', scrollSnapAlign: 'start' },
  themeToggle: { position: 'absolute', top: '20px', right: '20px', zIndex: 10, background: 'rgba(156, 163, 175, 0.2)', border: 'none', padding: '10px 14px', borderRadius: '50%', cursor: 'pointer', fontSize: '16px' },
  card: { backgroundColor: '#ffffff', padding: '35px', borderRadius: '20px', width: '100%', maxWidth: '360px', willChange: 'transform, box-shadow' },
  header: { textAlign: 'center', marginBottom: '25px' },
  liveIndicatorContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' },
  liveDotGreen: { width: '7px', height: '7px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #10b981' },
  liveDotBlue: { width: '7px', height: '7px', backgroundColor: '#60a5fa', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #60a5fa' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  labelLight: { fontSize: '12px', fontWeight: 'bold', color: '#4b5563' },
  labelDark: { fontSize: '12px', fontWeight: 'bold', color: '#9ca3af' },
  lightInput: { padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#fff', color: '#1f2937' },
  darkInput: { padding: '12px', border: '1px solid #4b5563', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#374151', color: '#fff' },
  studentBtn: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
  adminBtn: { backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
  toggleRow: { textAlign: 'center', marginTop: '5px' },
  linkLight: { fontSize: '13px', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' },
  linkDark: { fontSize: '13px', color: '#60a5fa', cursor: 'pointer', textDecoration: 'underline' },
  switchTerminalBox: { borderTop: '1px solid #e5e7eb', marginTop: '25px', paddingTop: '20px', textAlign: 'center' },
  slideNextBtn: { background: 'none', border: '1px solid #cbd5e1', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#4b5563', fontSize: '13px' },
  slidePrevBtn: { background: 'none', border: '1px solid #4b5563', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#9ca3af', fontSize: '13px' },
  errorAlert: { backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '15px', textAlign: 'center' },
  successAlert: { backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '15px', textAlign: 'center' }
};

export default IndexPortal;

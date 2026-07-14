import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IndexPortal = () => {
  const navigate = useNavigate();
  
  // 0 = Student Portal View, 1 = Admin Console View
  const [activePanel, setActivePanel] = useState(0);
  // Controls when the walking animation state is active
  const [isWalking, setIsWalking] = useState(false);

  // Student Authentication States
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [isStudentRegister, setIsStudentRegister] = useState(false);

  // Admin Authentication States
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [masterAdminEmail, setMasterAdminEmail] = useState(''); 
  const [isAdminRegister, setIsAdminRegister] = useState(false);

  const [error, setError] = useState('');

  // Triggers the walk to center before switching forms
  const triggerPanelSwitch = (targetPanel) => {
    setError('');
    setIsWalking(true); // Start the walking animation sequence
    
    // After 1.2 seconds (when the man reaches the center), flip the panel view
    setTimeout(() => {
      setActivePanel(targetPanel);
      setIsWalking(false); // Reset animation state for next click
    }, 1200);
  };

  const handleAuth = (e, type, isRegister) => {
    e.preventDefault();
    setError('');
    const email = type === 'admin' ? adminEmail : studentEmail;
    const password = type === 'admin' ? adminPassword : studentPassword;

    if (!email.trim() || !password.trim()) {
      return setError('Please fill in all secure authentication inputs.');
    }
    if (type === 'admin' && isRegister && !masterAdminEmail.trim()) {
      return setError('Access Denied: Master Admin email verification signature required.');
    }

    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', type);

    if (type === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{
      ...styles.viewWindow,
      backgroundColor: activePanel === 0 ? '#f0fdf4' : '#0f172a'
    }}>
      
      {/* Injecting Live CSS Animations for the Walking Sequence directly into the DOM */}
      <style>{`
        @keyframes walkToCenter {
          0% { transform: translateX(0px); }
          50% { transform: translateX(120px) translateY(-10px); }
          100% { transform: translateX(240px) translateY(0px); }
        }
        @keyframes walkBackToCenter {
          0% { transform: translateX(0px); }
          50% { transform: translateX(-120px) translateY(-10px); }
          100% { transform: translateX(-240px) translateY(0px); }
        }
        .animate-student-walk {
          animation: walkToCenter 1.2s cubic-bezier(0.45, 0, 0.55, 1) forwards;
        }
        .animate-admin-walk {
          animation: walkBackToCenter 1.2s cubic-bezier(0.45, 0, 0.55, 1) forwards;
        }
      `}</style>
      
      <div style={styles.mainContainer}>
        
        {/* ================= LEFT SIDE: DYNAMIC GRAPHIC AREA ================= */}
        <div style={styles.graphicColumn}>
          <div className={isWalking ? (activePanel === 0 ? 'animate-student-walk' : 'animate-admin-walk') : ''}>
            {activePanel === 0 ? (
              /* STUDENT MAN WITH A FORM */
              <svg width="260" height="260" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="70" fill="#dcfce7" />
                <path d="M70 150 C70 120, 130 120, 130 150" fill="#10b981" />
                <circle cx="100" cy="90" r="22" fill="#fbcfe8" />
                <path d="M80 80 C85 70, 115 70, 120 80 C110 75, 90 75, 80 80" fill="#1e293b" />
                {/* Form Clipboard */}
                <rect x="120" y="105" width="40" height="50" rx="4" fill="#ffffff" stroke="#10b981" strokeWidth="3"/>
                <rect x="128" y="115" width="24" height="4" fill="#cbd5e1" />
                <rect x="128" y="125" width="24" height="4" fill="#cbd5e1" />
                <circle cx="140" cy="140" r="3" fill="#10b981" />
              </svg>
            ) : (
              /* ADMIN MAN WITH AN OFFICE BRIEFCASE BAG */
              <svg width="260" height="260" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="70" fill="#334155" />
                <path d="M70 150 C70 120, 130 120, 130 150" fill="#4f46e5" />
                <circle cx="100" cy="90" r="22" fill="#fed7aa" />
                <path d="M80 80 C85 70, 115 70, 120 80 C110 75, 90 75, 80 80" fill="#451a03" />
                <path d="M96 122 L104 122 L102 138 L98 138 Z" fill="#ef4444" />
                {/* Briefcase/Office Bag */}
                <rect x="120" y="118" width="46" height="34" rx="5" fill="#78350f" stroke="#f59e0b" strokeWidth="2"/>
                <path d="M133 118 L133 112 C133 110, 153 110, 153 112 L153 118" stroke="#f59e0b" strokeWidth="2" fill="none"/>
              </svg>
            )}
          </div>
          <h3 style={{ 
            color: activePanel === 0 ? '#047857' : '#818cf8', 
            marginTop: '15px',
            transition: 'color 0.5s ease'
          }}>
            {activePanel === 0 ? 'Student Entry Terminal' : 'Infrastructure Control Layer'}
          </h3>
        </div>

        {/* ================= RIGHT SIDE: DYNAMIC AUTH PORTAL ================= */}
        <div style={styles.cardColumn}>
          {activePanel === 0 ? (
            /* STUDENT LOGIN/REGISTER FORM */
            <div style={styles.card} className="card-animated">
              <div style={styles.header}>
                <h2 style={{ color: '#1f2937', margin: '0 0 5px 0' }}>Student Portal</h2>
                <p style={{ color: '#6b7280', fontSize: '12px', margin: 0, textTransform: 'uppercase' }}>Online Examination Terminal</p>
              </div>

              {error && <div style={styles.errorAlert}>⚠️ {error}</div>}

              <form onSubmit={(e) => handleAuth(e, 'student', isStudentRegister)} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.labelLight}>Student Email</label>
                  <input 
                    type="email" 
                    placeholder="student@university.com" 
                    value={studentEmail}
                    onChange={e => setStudentEmail(e.target.value)}
                    required 
                    style={styles.lightInput}
                    className="input-animated"
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
                    className="input-animated"
                  />
                </div>

                <button type="submit" style={styles.studentBtn} className="btn-animated">
                  {isStudentRegister ? 'Register Profile' : 'Secure Student Sign In'}
                </button>

                <div style={styles.toggleRow}>
                  <span onClick={() => setIsStudentRegister(!isStudentRegister)} style={styles.linkLight} className="btn-animated">
                    {isStudentRegister ? 'Already have an account? Sign In' : 'New student? Register Here'}
                  </span>
                </div>
              </form>

              <div style={styles.switchTerminalBox}>
                <p style={{ fontSize: '13px', color: '#4b5563', margin: '0 0 8px 0' }}>Need administrative tools?</p>
                <button 
                  type="button" 
                  onClick={() => triggerPanelSwitch(1)} 
                  style={styles.slideNextBtn} 
                  className="btn-animated"
                  disabled={isWalking}
                >
                  Slide to Admin Console ➔
                </button>
              </div>
            </div>
          ) : (
            /* ADMIN INFRASTRUCTURE FORM */
            <div style={{ ...styles.card, backgroundColor: '#1e293b', border: '1px solid #334155' }} className="card-animated">
              <div style={styles.header}>
                <h2 style={{ color: '#f8fafc', margin: '0 0 5px 0' }}>Admin Console</h2>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0, textTransform: 'uppercase' }}>Secure Infrastructure Access</p>
              </div>

              {error && <div style={styles.errorAlert}>⚠️ {error}</div>}

              <form onSubmit={(e) => handleAuth(e, 'admin', isAdminRegister)} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.labelDark}>Admin Email</label>
                  <input 
                    type="email" 
                    placeholder="admin@university.com" 
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    required 
                    style={styles.darkInput}
                    className="input-animated"
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
                    className="input-animated"
                  />
                </div>

                {isAdminRegister && (
                  <div style={styles.inputGroup}>
                    <label style={styles.labelDark}>Master Admin Code Signature ID</label>
                    <input 
                      type="text" 
                      placeholder="Verification Authority Key" 
                      value={masterAdminEmail}
                      onChange={e => setMasterAdminEmail(e.target.value)}
                      required 
                      style={styles.darkInput}
                      className="input-animated"
                    />
                  </div>
                )}

                <button type="submit" style={styles.adminBtn} className="btn-animated">
                  {isAdminRegister ? 'Provision Master Credentials' : 'Access System Terminal'}
                </button>

                <div style={styles.toggleRow}>
                  <span onClick={() => setIsAdminRegister(!isAdminRegister)} style={styles.linkDark} className="btn-animated">
                    {isAdminRegister ? 'Return to Standard Admin Login' : 'Register New Supervisor Instance'}
                  </span>
                </div>
              </form>

              <div style={{ ...styles.switchTerminalBox, borderTop: '1px solid #334155' }}>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 8px 0' }}>Are you an academic student candidate?</p>
                <button 
                  type="button" 
                  onClick={() => triggerPanelSwitch(0)} 
                  style={{ ...styles.slideNextBtn, color: '#cbd5e1', borderColor: '#4b5563' }} 
                  className="btn-animated"
                  disabled={isWalking}
                >
                  🪟 Return to Student Workspace View
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const styles = {
  viewWindow: { 
    width: '100vw', 
    height: '100vh', 
    overflow: 'hidden', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 0.6s ease'
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '60px',
    width: '100%',
    maxWidth: '1000px',
    padding: '20px',
    boxSizing: 'border-box'
  },
  graphicColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '320px',
    textAlign: 'center'
  },
  cardColumn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '460px'
  },
  card: { 
    padding: '40px 35px', 
    borderRadius: '24px', 
    backgroundColor: '#ffffff', 
    boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)', 
    border: '1px solid #e2e8f0', 
    width: '100%', 
    boxSizing: 'border-box' 
  },
  header: { textAlign: 'center', marginBottom: '24px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  labelLight: { fontSize: '12px', fontWeight: 'bold', color: '#4b5563' },
  labelDark: { fontSize: '12px', fontWeight: 'bold', color: '#9ca3af' },
  lightInput: { padding: '13px 16px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', outline: 'none', color: '#1f2937', width: '100%', boxSizing: 'border-box' },
  darkInput: { padding: '13px 16px', border: '1px solid #4b5563', borderRadius: '10px', fontSize: '14px', outline: 'none', backgroundColor: '#334155', color: '#fff', width: '100%', boxSizing: 'border-box' },
  studentBtn: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', outline: 'none', cursor: 'pointer', width: '100%' },
  adminBtn: { backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', outline: 'none', cursor: 'pointer', width: '100%' },
  toggleRow: { textAlign: 'center', marginTop: '5px' },
  linkLight: { fontSize: '13px', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' },
  linkDark: { fontSize: '13px', color: '#818cf8', cursor: 'pointer', textDecoration: 'underline' },
  switchTerminalBox: { borderTop: '1px solid #e5e7eb', marginTop: '25px', paddingTop: '20px', textAlign: 'center' },
  slideNextBtn: { background: 'none', border: '1px solid #cbd5e1', padding: '11px 18px', borderRadius: '10px', fontWeight: 'bold', color: '#4b5563', fontSize: '13px', outline: 'none', cursor: 'pointer' },
  errorAlert: { padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: '13px', borderRadius: '8px', textAlign: 'center', fontWeight: '500', marginBottom: '10px' }
};

export default IndexPortal;

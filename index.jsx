import React, { useState, useRef } from 'react';
// Ensure your styles are imported if they aren't already:
// import './style.css'; 

const IndexPortal = ({ navigateTo }) => {
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [isStudentRegister, setIsStudentRegister] = useState(false);

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [masterAdminEmail, setMasterAdminEmail] = useState('');
  const [isAdminRegister, setIsAdminRegister] = useState(false);

  const [error, setError] = useState('');
  const scrollContainerRef = useRef(null);

  const scrollToPanel = (panelIndex) => {
    setError('');
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
    if (type === 'admin') { navigateTo('/admin'); } else { navigateTo('/dashboard'); }
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative font-sans">
      
      {/* Clean Character Elements linked to your style.css properties */}
      <div className="pure-css-walker">
        <div className="human-head"></div>
        <div className="human-body"></div>
        <div className="office-bag">
          <div className="office-bag-handle"></div>
        </div>
        <div className="human-leg leg-left"></div>
        <div className="human-leg leg-right"></div>
      </div>

      <div className="flex w-full h-full overflow-x-hidden snap-x snap-mandatory" ref={scrollContainerRef}>
        {/* ================= PANEL 1: STUDENT PORTAL ================= */}
        <div className="min-w-full h-full bg-gray-100 flex justify-center items-center snap-start">
          <div className="bg-white p-[30px] rounded-xl shadow-md w-[380px]">
            <div className="text-center mb-6">
              <h2 className="text-gray-800 text-2xl font-bold mb-1">Student Portal</h2>
              <p className="text-gray-500 text-xs tracking-wider uppercase">Online Examination Terminal</p>
            </div>

            {error && !isAdminRegister && (
              <div className="bg-red-100 text-red-600 p-2.5 rounded-md mb-4 text-sm text-center">⚠️ {error}</div>
            )}

            <form onSubmit={(e) => handleAuth(e, 'student', isStudentRegister)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Student Email</label>
                <input 
                  type="email" 
                  placeholder="student@university.com" 
                  value={studentEmail}
                  onChange={e => setStudentEmail(e.target.value)}
                  required 
                  className="p-2.5 rounded-md border border-gray-300 text-sm w-full outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={studentPassword}
                  onChange={e => setStudentPassword(e.target.value)}
                  required 
                  className="p-2.5 rounded-md border border-gray-300 text-sm w-full outline-none focus:border-blue-500"
                />
              </div>

              <button type="submit" className="p-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer transition-colors">
                {isStudentRegister ? 'Register Profile' : 'Secure Student Sign In'}
              </button>

              <div className="text-center mt-1">
                <span onClick={() => setIsStudentRegister(!isStudentRegister)} className="text-xs text-blue-600 cursor-pointer underline">
                  {isStudentRegister ? 'Already have an account? Sign In' : 'New student? Register Here'}
                </span>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-600 mb-2">Need administrative tools?</p>
              <button type="button" onClick={() => scrollToPanel(1)} className="bg-transparent border-none text-gray-600 hover:text-gray-900 cursor-pointer font-semibold text-sm">
                Slide to Admin Console ➔
              </button>
            </div>
          </div>
        </div>

        {/* ================= PANEL 2: ADMIN SYSTEM CONSOLE ================= */}
        <div className="min-w-full h-full bg-gray-900 flex justify-center items-center snap-start">
          <div className="bg-gray-800 border border-gray-700 p-[30px] rounded-xl shadow-md w-[380px]">
            <div className="text-center mb-6">
              <h2 className="text-gray-5
font-bold text-2xl mb-1">Admin Console</h2>
              <p className="text-gray-400 text-xs tracking-wider uppercase">Secure Infrastructure Access</p>
            </div>

            {error && isAdminRegister && (
              <div className="bg-red-100 text-red-600 p-2.5 rounded-md mb-4 text-sm text-center">⚠️ {error}</div>
            )}

            <form onSubmit={(e) => handleAuth(e, 'admin', isAdminRegister)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Admin Email</label>
                <input 
                  type="email" 
                  placeholder="admin@university.com" 
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  required 
                  className="p-2.5 rounded-md border border-gray-600 bg-gray-700 text-white text-sm w-full outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  required 
                  className="p-2.5 rounded-md border border-gray-600 bg-gray-700 text-white text-sm w-full outline-none focus:border-emerald-500"
                />
              </div>

              {isAdminRegister && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-red-400">Master Admin Email Verification</label>
                  <input 
                    type="email" 
                    placeholder="existing.admin@university.com" 
                    value={masterAdminEmail}
                    onChange={e => setMasterAdminEmail(e.target.value)}
                    required 
                    className="p-2.5 rounded-md border border-red-500 bg-gray-700 text-white text-sm w-full outline-none"
                  />
                </div>
              )}

              <button type="submit" className="p-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer transition-colors">
                {isAdminRegister ? 'Deploy New Admin' : 'Secure Admin Login'}
              </button>

              <div className="text-center mt-1">
                <span onClick={() => setIsAdminRegister(!isAdminRegister)} className="text-xs text-emerald-400 cursor-pointer underline">
                  {isAdminRegister ? 'Cancel Registration' : 'New Admin? Register Profile'}
                </span>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-700 text-center">
              <p className="text-xs text-gray-400 mb-2">Are you a test taker?</p>
              <button type="button" onClick={() => scrollToPanel(0)} className="bg-transparent border-none text-gray-400 hover:text-gray-200 cursor-pointer font-semibold text-sm">
                ◀ Return to Student Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPortal;

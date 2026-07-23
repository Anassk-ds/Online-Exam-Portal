import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from './useTheme.js';
import './landing.css';
import {
  FiSun, FiMoon, FiArrowRight, FiClock, FiShield, FiBarChart2, FiCode,
  FiPercent, FiMessageSquare, FiGrid, FiPieChart, FiGlobe, FiCheckCircle,
  FiUserCheck, FiLock, FiUsers
} from 'react-icons/fi';

const TOPICS = [
  {
    code: 'QA-101',
    icon: <FiPercent />,
    title: 'Quantitative Aptitude',
    desc: 'Arithmetic, algebra, percentages, and profit & loss — built for speed and accuracy.'
  },
  {
    code: 'VR-102',
    icon: <FiMessageSquare />,
    title: 'Verbal Reasoning',
    desc: 'Reading comprehension, analogies, sentence correction, and critical reasoning.'
  },
  {
    code: 'LR-103',
    icon: <FiGrid />,
    title: 'Logical Reasoning',
    desc: 'Puzzles, seating arrangements, syllogisms, and pattern recognition.'
  },
  {
    code: 'CS-104',
    icon: <FiCode />,
    title: 'Programming & Coding',
    desc: 'Live code execution across data structures, algorithms, and core logic.'
  },
  {
    code: 'DI-105',
    icon: <FiPieChart />,
    title: 'Data Interpretation',
    desc: 'Charts, tables, and graphs — extract insight and compute fast under pressure.'
  },
  {
    code: 'GA-106',
    icon: <FiGlobe />,
    title: 'General Awareness',
    desc: 'Current affairs, static GK, and everyday business awareness.'
  }
];

const STEPS = [
  { title: 'Create your account', desc: 'Register as a student or admin in under a minute.' },
  { title: 'Get approved & sign in', desc: 'Students are verified before their first exam.' },
  { title: 'Take a timed exam', desc: 'Fullscreen, proctored, and tab-switch protected.' },
  { title: 'View instant results', desc: 'Auto-graded the moment you submit.' }
];

const FEATURES = [
  {
    icon: <FiShield />,
    title: 'Anti-cheat proctoring',
    desc: 'Fullscreen enforcement and tab-switch detection auto-submit an exam the moment a violation is detected.'
  },
  {
    icon: <FiBarChart2 />,
    title: 'Instant auto-grading',
    desc: 'No waiting on results — scores are calculated and available the second you submit.'
  },
  {
    icon: <FiUsers />,
    title: 'Role-based dashboards',
    desc: 'Purpose-built views for students taking exams and admins managing them.'
  },
  {
    icon: <FiLock />,
    title: 'Secure by design',
    desc: 'Encrypted credentials and an approval workflow before any student account goes live.'
  }
];

const TICKET_DURATION = 30; // seconds shown per subject in the animated ticket

const Landing = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [subjectIndex, setSubjectIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(TICKET_DURATION);

  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setSubjectIndex((i) => (i + 1) % TOPICS.length);
          return TICKET_DURATION;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const activeTopic = TOPICS[subjectIndex];
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');
  const progressPct = (secondsLeft / TICKET_DURATION) * 100;

  return (
    <div className="lp-page page-fade-in">
      <div className="lp-noise" />

      <nav className="lp-nav">
        <div className="lp-brand">
          <span className="lp-brand-mark"><FiCheckCircle /></span>
          ExamPortal
        </div>
        <div className="lp-nav-actions">
          <a href="#topics" className="lp-nav-link">Topics</a>
          <a href="#how-it-works" className="lp-nav-link">How it works</a>
          <button onClick={toggleTheme} className="theme-toggle-btn btn-animated" aria-label="Toggle theme">
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>
          <button className="lp-btn-login btn-animated" onClick={() => navigate('/login')}>
            Login <FiArrowRight />
          </button>
        </div>
      </nav>

      <header className="lp-hero">
        <div>
          <span className="lp-eyebrow"><FiUserCheck /> For students & administrators</span>
          <h1>Practice for real. <em>Get graded instantly.</em></h1>
          <p className="lp-hero-sub">
            Timed, proctored exams across the topics that actually show up in placements and
            competitive tests — quantitative aptitude, verbal and logical reasoning, coding, and more.
          </p>
          <div className="lp-hero-ctas">
            <button className="lp-btn-primary btn-animated" onClick={() => navigate('/login')}>
              Get Started <FiArrowRight />
            </button>
            <a href="#topics" className="lp-btn-secondary btn-animated">Explore Topics</a>
          </div>
          <div className="lp-hero-stats">
            <div className="lp-stat"><b>6+</b><span>Exam categories</span></div>
            <div className="lp-stat"><b>100%</b><span>Auto-graded</span></div>
            <div className="lp-stat"><b>0</b><span>Grading delay</span></div>
          </div>
        </div>

        <div className="lp-ticket-wrap">
          <div className="lp-ticket">
            <div className="lp-ticket-top">
              <div className="lp-ticket-row">
                <span className="lp-ticket-label">Exam Ticket</span>
                <span className="lp-ticket-live"><span className="lp-ticket-dot" /> LIVE</span>
              </div>
              <div className="lp-ticket-row">
                <span className="lp-ticket-code">{activeTopic.code}</span>
              </div>
              <div className="lp-ticket-subject">{activeTopic.title}</div>
              <div className="lp-ticket-desc">{activeTopic.desc}</div>
            </div>
            <div className="lp-ticket-divider" />
            <div className="lp-ticket-bottom" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div className="lp-ticket-timer-label">Time remaining</div>
                  <div className="lp-ticket-timer">{minutes}:{secs}</div>
                </div>
                <div className="lp-ticket-timer-label">Auto-submit on timeout</div>
              </div>
              <div className="lp-ticket-bar-track">
                <div className="lp-ticket-bar-fill" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="lp-section" id="topics">
        <div className="lp-section-head">
          <div className="lp-section-eyebrow">Exam categories</div>
          <h2>Topics built to sharpen the skills that matter</h2>
          <p>Every category below maps to a real exam paper on the platform, ready to attempt the moment you sign in.</p>
        </div>
        <div className="lp-topics-grid">
          {TOPICS.map((t) => (
            <div className="lp-topic-card" key={t.code}>
              <div className="lp-topic-top">
                <span className="lp-topic-icon">{t.icon}</span>
                <span className="lp-topic-paper">{t.code}</span>
              </div>
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-section" id="how-it-works">
        <div className="lp-section-head">
          <div className="lp-section-eyebrow">How it works</div>
          <h2>From registration to results, in four steps</h2>
        </div>
        <div className="lp-steps">
          {STEPS.map((s, i) => (
            <div className="lp-step" key={s.title}>
              <div className="lp-step-num">{i + 1}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-section-head">
          <div className="lp-section-eyebrow">Why this portal</div>
          <h2>Everything you need to run — or take — a fair exam</h2>
        </div>
        <div className="lp-features">
          {FEATURES.map((f) => (
            <div className="lp-feature" key={f.title}>
              <span className="lp-feature-icon">{f.icon}</span>
              <div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="lp-cta-band">
        <div>
          <h3>Ready to test yourself?</h3>
          <p>Create your account and take your first timed exam today.</p>
        </div>
        <button className="lp-btn-on-color btn-animated" onClick={() => navigate('/login')}>
          Login / Register <FiArrowRight />
        </button>
      </div>

      <footer className="lp-footer">
        <span>© {new Date().getFullYear()} ExamPortal. All rights reserved.</span>
        <div>
          <Link to="/login">Login</Link>
          <Link to="/forgot-password">Forgot Password</Link>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

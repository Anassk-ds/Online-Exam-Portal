import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ExamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    fetch(`/api/exams/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch exam details.');
        return res.json();
      })
      .then((data) => {
        setExam(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Something went wrong. Please try again later.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={styles.centerScreen}>
        <div style={styles.spinner} />
        <p style={{ color: '#64748b', marginTop: '16px' }}>Loading exam details...</p>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div style={styles.centerScreen}>
        <p style={{ color: '#dc2626', fontWeight: 'bold', marginBottom: '16px' }}>
          {error || 'Exam not found.'}
        </p>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn} className="btn-animated">
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const startDate = new Date(exam.startDate);
  const endDate = new Date(exam.endDate);
  const now = new Date();
  
  let status = 'Active';
  let badgeColor = '#dcfce7';
  let textColor = '#16a34a';

  if (now < startDate) {
    status = 'Upcoming';
    badgeColor = '#fef3c7';
    textColor = '#d97706';
  } else if (now > endDate) {
    status = 'Expired';
    badgeColor = '#fee2e2';
    textColor = '#dc2626';
  }

  return (
    <div style={styles.centerScreen} className="page-fade-in">
      <div style={styles.card} className="card-animated">
        <Link to="/dashboard" style={styles.backLink} className="btn-animated">← Return to Main Panel Dashboard</Link>
        <h1 style={styles.title}>{exam.title}</h1>
        
        <div style={{ ...styles.statusBadge, backgroundColor: badgeColor, color: textColor }}>
          ● {status} Assessment Matrix Slot
        </div>

        <div style={styles.detailGrid}>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Opening Time Window</span>
            <span style={styles.detailValue}>{startDate.toLocaleString()}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Absolute Session Deadline</span>
            <span style={styles.detailValue}>{endDate.toLocaleString()}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Questions Core Payload Count</span>
            <span style={styles.detailValue}>{exam.questions?.length || 0} Modules Synced</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Exam Identification Code Reference</span>
            <span style={styles.detailValue}>{exam._id}</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginBottom: '25px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#475569' }}>🔒 Integrity Infrastructure Guidelines:</h4>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
            Launching this system panel binds your identity record onto our supervisor data layer metrics logs. Refrain from workspace pane re-initialization actions once the session timer mounts.
          </p>
        </div>

        {status === 'Active' ? (
          <button onClick={() => navigate(`/take-exam/${exam._id}`)} style={styles.startBtn} className="btn-animated">
            Authorize Workspace Launch Sequence ➔
          </button>
        ) : (
          <button disabled style={{ ...styles.startBtn, backgroundColor: '#cbd5e1', color: '#94a3b8', cursor: 'not-allowed' }}>
            🔒 Evaluation Port Closed
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  centerScreen: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px', fontFamily: 'sans-serif' },
  spinner: { width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  card: { backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', padding: '35px', width: '100%', maxWidth: '600px' },
  backLink: { fontSize: '13px', color: '#2563eb', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' },
  title: { margin: '0 0 10px 0', fontSize: '24px', color: '#0f172a' },
  statusBadge: { display: 'inline-block', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginBottom: '25px' },
  detailGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '30px' },
  detailItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  detailLabel: { fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' },
  detailValue: { fontSize: '14px', color: '#1e293b', fontWeight: '600', wordBreak: 'break-all' },
  startBtn: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', width: '100%', fontSize: '14px', outline: 'none' },
  backBtn: { backgroundColor: '#4b5563', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }
};

export default ExamDetails;

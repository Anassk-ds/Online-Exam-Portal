import React, { useState, useEffect } from 'react';

const StudentDashboard = ({ navigateTo }) => {
  const [activeTab, setActiveTab] = useState('Home'); 
  const [examsList, setExamsList] = useState([]); 
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedResultId, setExpandedResultId] = useState(null);
  
  const studentEmail = localStorage.getItem('userEmail') || '';

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api/student/exams').then(res => res.json()).catch(() => []), 
      fetch(`/api/student/results?email=${studentEmail}`).then(res => res.json()).catch(() => [])
    ])
    .then(([examsData, resultsData]) => {
      setExamsList(Array.isArray(examsData) ? examsData : []);
      setResults(Array.isArray(resultsData) ? resultsData : []);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to sync structural dashboard data:", err);
      setLoading(false);
    });
  }, [studentEmail]);

  const toggleResultExpansion = (id) => {
    setExpandedResultId(expandedResultId === id ? null : id);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigateTo('/');
  };

  // Routes via the query string format (?id=) that take-exam.jsx reads.
  // Uses navigateTo (SPA pushState routing) instead of a hard
  // window.location.href reload, so it stays consistent with how the
  // rest of the app navigates and doesn't blow away in-memory state.
  const handleLaunchExamProcedure = (examId) => {
    if (!examId) {
      alert("⚠️ Error: Exam mapping signature is corrupted or blank.");
      return;
    }

    fetch(`/api/student/check-attempt?email=${studentEmail}&examId=${examId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.allowed === false) {
          alert(data.error || "🔒 Access Blocked: You have already submitted this exam sheet.");
        } else {
          navigateTo(`/take-exam?id=${examId}`);
        }
      })
      .catch(() => {
        // Fallback bypass routing logic if the attempt-check call itself fails
        navigateTo(`/take-exam?id=${examId}`);
      });
  };

  if (loading) return <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center', color: '#475569' }}>🔄 Fetching Profile Metrics Panels...</div>;

  return (
    <div style={styles.dashboardContainer}>
      {/* Sidebar Command Ribbon */}
      <div style={styles.sidebarPanel}>
        <div style={{ padding: '25px 20px' }}>
          <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '18px', fontWeight: 'bold' }}>🎓 Student Hub</h3>
          <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{studentEmail}</p>
        </div>
        <div style={styles.navigationMenuOptions}>
          <button onClick={() => setActiveTab('Home')} style={{ ...styles.menuBtn, backgroundColor: activeTab === 'Home' ? '#1e293b' : 'transparent', color: activeTab === 'Home' ? '#3b82f6' : '#94a3b8' }}>🏠 Central Hub</button>
          <button onClick={() => setActiveTab('Exams')} style={{ ...styles.menuBtn, backgroundColor: activeTab === 'Exams' ? '#1e293b' : 'transparent', color: activeTab === 'Exams' ? '#3b82f6' : '#94a3b8' }}>✍️ Available Slots</button>
          <button onClick={() => setActiveTab('Results')} style={{ ...styles.menuBtn, backgroundColor: activeTab === 'Results' ? '#1e293b' : 'transparent', color: activeTab === 'Results' ? '#3b82f6' : '#94a3b8' }}>📊 Performance Review</button>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtnRow}>🚪 Log Out Profile</button>
      </div>

      {/* Main Container Viewport Panel */}
      <div style={styles.mainViewportWorkspace}>
        {activeTab === 'Home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={styles.welcomeBannerCard}>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold' }}>Welcome Back, Student!</h1>
              <p style={{ margin: 0, opacity: 0.85, fontSize: '14px' }}>System Time: {currentTime.toLocaleTimeString()} | Review your pending challenges or track graded logs via the control console.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={styles.miniMetricWidgetBox}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>AVAILABLE ASSIGNMENT WINDOWS</span>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', marginTop: '5px' }}>{examsList.length} Active Slots</div>
              </div>
              <div style={styles.miniMetricWidgetBox}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>COMPLETED EVALUATION SHEET PACKETS</span>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', marginTop: '5px' }}>{results.length} Submitted</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Exams' && (
          <div style={styles.sectionAreaCard}>
            <h3 style={styles.sectionCardTitle}>✍️ Live Scheduled Test Slots</h3>
            <div style={styles.list}>
              {examsList.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>No assessment blocks have been declared by system supervisors.</div>
              ) : (
                examsList.map((exam) => {
                  const start = new Date(exam.startDate);
                  const end = new Date(exam.endDate);
                  const isUpcoming = currentTime < start;
                  const isExpired = currentTime > end;
                  const isOpen = !isUpcoming && !isExpired;

                  return (
                    <div key={exam._id} style={styles.itemCard}>
                      <div>
                        <h4 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '16px' }}>{exam.title}</h4>
                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span>📅 Opens: {start.toLocaleString()}</span>
                          <span>🛑 Closes: {end.toLocaleString()}</span>
                        </div>
                      </div>
                      <div>
                        {isOpen ? (
                          <button onClick={() => handleLaunchExamProcedure(exam._id)} style={styles.startBtn}>Start Test</button>
                        ) : isUpcoming ? (
                          <span style={{ ...styles.statusBadge, backgroundColor: '#fef3c7', color: '#d97706' }}>🔒 Locked</span>
                        ) : (
                          <span style={{ ...styles.statusBadge, backgroundColor: '#fee2e2', color: '#dc2626' }}>❌ Terminated</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'Results' && (
          <div style={styles.sectionAreaCard}>
            <h3 style={styles.sectionCardTitle}>📊 Documented Grade Ledger</h3>
            {results.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>You have not uploaded any exam submission sheets yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {results.map((res) => {
                  const isExpanded = expandedResultId === res._id;
                  return (
                    <div key={res._id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                      <div onClick={() => toggleResultExpansion(res._id)} style={{ padding: '15px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                        <div>
                          <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{res.examTitle}</span>
                          <span style={{ marginLeft: '15px', fontSize: '12px', color: '#64748b' }}>{new Date(res.dateCompleted).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <span style={{ fontWeight: 'bold', color: '#16a34a' }}>{res.score}</span>
                          <span style={{ fontSize: '12px', color: '#94a3b8' }}>{isExpanded ? '▲ Hide' : '▼ View Review'}</span>
                        </div>
                      </div>

                      {isExpanded && res.questionsSnapshot && (
                        <div style={{ padding: '20px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                          {res.questionsSnapshot.map((q, qIdx) => {
                            const studentAns = res.studentAnswers?.[qIdx];
                            
                            if (q.type === 'coding') {
                              return (
                                <div key={qIdx} style={{ padding: '15px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
                                  <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '14px' }}>Challenge {qIdx + 1} (Coding): {q.codingProblemStatement || q.text}</p>
                                  <div style={{ fontSize: '13px', fontFamily: 'monospace', backgroundColor: '#0f172a', color: '#38bdf8', padding: '12px', borderRadius: '6px', whiteSpace: 'pre-wrap' }}>
                                    {studentAns?.code || '// No compilation solutions code was submitted.'}
                                  </div>
                                </div>
                              );
                            }

                            const isCorrect = studentAns === q.correct;
                            return (
                              <div key={qIdx} style={{ padding: '15px', borderLeft: isCorrect ? '4px solid #10b981' : '4px solid #ef4444', backgroundColor: '#f8fafc', borderRadius: '0 6px 6px 0' }}>
                                <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '14px' }}>Question {qIdx + 1}: {q.text || q.questionText}</p>
                                <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <span style={{ color: isCorrect ? '#16a34a' : '#dc2626' }}>
                                    <strong>Your Selection:</strong> {studentAns ? `[Option ${studentAns}] ${q[`option${studentAns}`] || ''}` : 'Left Unanswered'}
                                  </span>
                                  {!isCorrect && (
                                    <span style={{ color: '#16a34a' }}>
                                      <strong>Correct Target Answer:</strong> [Option {q.correct}] {q[`option${q.correct}`]}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  dashboardContainer: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' },
  sidebarPanel: { width: '260px', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid #1e293b' },
  navigationMenuOptions: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 10px', flex: 1 },
  menuBtn: { border: 'none', padding: '12px 15px', borderRadius: '8px', textAlign: 'left', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },
  logoutBtnRow: { margin: '20px', padding: '12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' },
  mainViewportWorkspace: { flex: 1, padding: '40px', overflowY: 'auto' },
  welcomeBannerCard: { backgroundColor: '#3b82f6', color: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(59,130,246,0.15)' },
  miniMetricWidgetBox: { backgroundColor: '#fff', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' },
  sectionAreaCard: { backgroundColor: '#fff', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0' },
  sectionCardTitle: { fontSize: '18px', margin: '0 0 20px 0', color: '#0f172a', fontWeight: '700' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  itemCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' },
  startBtn: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },
  statusBadge: { padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }
};

export default StudentDashboard;
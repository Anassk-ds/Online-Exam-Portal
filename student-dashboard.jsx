import { useState, useEffect } from "react";
import {
  getExams,
  getResults,
  submitResult,
  checkAttempted,
} from "../services/apiClient";
import ChangePasswordModal from "./ChangePasswordModal";

export default function StudentDashboard({ user }) {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    loadExams();
    loadResults();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);
      const data = await getExams();
      setExams(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadResults = async () => {
    try {
      const data = await getResults(user.email);
      setResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartExam = async (exam) => {
    try {
      const attempted = await checkAttempted(exam._id, user.email);

      if (attempted) {
        alert("You have already attempted this exam.");
        return;
      }

      setSelectedExam(exam);
      setAnswers({});
      setScore(null);
    } catch (err) {
      alert(err.message);
    }
  };
    const handleAnswerChange = (questionIndex, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  const handleSubmitExam = async () => {
    if (!selectedExam) return;

    let totalScore = 0;

    selectedExam.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        totalScore++;
      }
    });

    try {
      setLoading(true);

      await submitResult({
        examId: selectedExam._id,
        examTitle: selectedExam.title,
        email: user.email,
        name: user.name,
        score: totalScore,
        totalQuestions: selectedExam.questions.length,
      });

      setScore(totalScore);

      await loadResults();

      alert(
        `Exam submitted successfully!\n\nYour Score: ${totalScore}/${selectedExam.questions.length}`
      );

      setSelectedExam(null);
      setAnswers({});
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
        <div className="student-dashboard">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>

        <div className="header-actions">
          <span className="welcome-text">
            Welcome, <strong>{user.name}</strong>
          </span>

          <button
            className="secondary-btn"
            onClick={() => setShowChangePassword(true)}
          >
            Change Password
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!selectedExam ? (
        <>
          <section className="available-exams">
            <h2>Available Exams</h2>

            {loading ? (
              <p>Loading exams...</p>
            ) : exams.length === 0 ? (
              <p>No exams available.</p>
            ) : (
              <div className="exam-list">
                {exams.map((exam) => (
                  <div
                    key={exam._id}
                    className="exam-card"
                  >
                    <h3>{exam.title}</h3>

                    <p>{exam.description}</p>

                    <p>
                      <strong>Questions:</strong>{" "}
                      {exam.questions.length}
                    </p>

                    <button
                      className="primary-btn"
                      onClick={() =>
                        handleStartExam(exam)
                      }
                    >
                      Start Exam
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="results-section">
            <h2>My Results </h2>
                        {results.length === 0 ? (
              <p>No exam results available.</p>
            ) : (
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th>Score</th>
                    <th>Total Questions</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((result) => (
                    <tr key={result._id}>
                      <td>{result.examTitle}</td>
                      <td>{result.score}</td>
                      <td>{result.totalQuestions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      ) : (
        <section className="exam-container">
          <h2>{selectedExam.title}</h2>

          <p>{selectedExam.description}</p>

          {selectedExam.questions.map((question, index) => (
            <div
              key={index}
              className="question-card"
            >
              <h3>
                Question {index + 1}
              </h3>

              <p>{question.question}</p>

              <div className="options">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="option-label"
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={() =>
                        handleAnswerChange(index, option)
                      }
                    />

                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
                    <div className="exam-actions">
            <button
              className="primary-btn"
              onClick={handleSubmitExam}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Exam"}
            </button>
          </div>
        </section>
      )}

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        userEmail={user.email}
      />

      {score !== null && (
        <div className="score-popup">
          <h3>Exam Completed!</h3>
          <p>Your Score: {score}</p>
        </div>
      )}
    </div>
  );
}

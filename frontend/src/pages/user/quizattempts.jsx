import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useQuizContext } from '../context/quizContext';
import './quiz.css';

const QuizAttempts = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { getAttemptsByQuizId, getQuizById } = useQuizContext();

  const [attempts, setAttempts] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [attemptData, quizData] = await Promise.all([
          getAttemptsByQuizId(quizId),
          getQuizById(quizId)
        ]);
        setAttempts(attemptData || []);
        setQuiz(quizData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId, getAttemptsByQuizId, getQuizById]);

  const handleBackToQuizzes = () => {
    navigate('/user/quizzes');
  };

  const quizTitle = quiz ? quiz.title : 'Unknown Quiz';

  return (
    <div className="quizzes-page">
      <div className="quizzes-container">
        <div className="topic-header">
          <div className="title-group">
            <h2>Previous Attempts for {quizTitle}</h2>
            <span>{attempts.length} Attempts</span>
          </div>
          <div className="header-actions">
            <button className="action-btn" onClick={handleBackToQuizzes}>
              <FaArrowLeft /> Back to Quizzes
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading attempts...</p>
        ) : attempts.length === 0 ? (
          <p>No attempts found for this quiz.</p>
        ) : (
          <div className="quizzes-list">
            <table className="attempts-table">
              <thead>
                <tr>
                  <th>Attempt ID</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt) => (
                  <tr key={attempt._id}>
                    <td>{attempt._id}</td>
                    <td>{attempt.score}%</td>
                    <td>{new Date(attempt.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizAttempts;

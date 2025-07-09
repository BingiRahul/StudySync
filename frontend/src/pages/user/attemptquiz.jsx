import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useQuizContext } from '../context/quizContext';
import './attemptquiz.css';

const AttemptQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getQuizById, recordQuizAttempt } = useQuizContext();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [remainingTime, setRemainingTime] = useState(null);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(true);
  const [timeInput, setTimeInput] = useState('');

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const fetchedQuiz = await getQuizById(id);
        setQuiz(fetchedQuiz);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [id, getQuizById]);

  const calculateScore = () => {
    if (!quiz || !quiz.questions) return 0;
    const correct = quiz.questions.reduce(
      (acc, question, index) =>
        acc + (userAnswers[index] === question.correctAnswer ? 1 : 0),
      0
    );
    return Math.round((correct / quiz.questions.length) * 100);
  };

  const handleSubmitQuiz = () => {
    const score = calculateScore();
    recordQuizAttempt(id, score);
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    navigate('/user/quizzes');
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      handleSubmitQuiz();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []); // ✅ no fullscreen request here anymore!

  useEffect(() => {
    if (remainingTime === null) return;

    if (remainingTime === 0) {
      handleSubmitQuiz();
      return;
    }

    const interval = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime, handleSubmitQuiz]);

  if (loading) {
    return <div className="quiz-container">Loading quiz...</div>;
  }

  if (!quiz) {
    return <div className="quiz-container">Quiz not found</div>;
  }

  const handleAnswerSelect = (answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleTimerStart = () => {
    let seconds = 0;

    if (timeInput.trim() === '') {
      seconds = quiz.questions.length * 60;
    } else {
      const minutes = parseInt(timeInput, 10);
      if (isNaN(minutes) || minutes <= 0) {
        alert('Please enter a valid time in minutes.');
        return;
      }
      seconds = minutes * 60;
    }

    // ✅ Request fullscreen only here, in user gesture
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    setRemainingTime(seconds);
    setIsTimerModalOpen(false);
  };

  const attempted = Object.keys(userAnswers).length;
  const notAttempted = quiz.questions.length - attempted;

  return (
    <div className="quiz-taking-page">
      {isTimerModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Set Quiz Time</h3>
            <p>
              Enter quiz duration (minutes). Leave blank for default (~1 minute per
              question = {quiz.questions.length} min).
            </p>
            <input
              type="number"
              min="1"
              placeholder={`e.g. ${quiz.questions.length}`}
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
            />
            <div className="modal-actions">
              <button className="modal-btn submit-btn" onClick={handleTimerStart}>
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {!isTimerModalOpen && (
        <div className="quiz-container">
          <div className="question-list">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                className={`question-number ${
                  currentQuestionIndex === index ? 'active' : ''
                } ${userAnswers[index] ? 'answered' : ''}`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="quiz-content">
            <div className="quiz-header">
              <h2>{quiz.title}</h2>
              <span className="progress-text">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / quiz.questions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="question">
              <h3>{quiz.questions[currentQuestionIndex].text}</h3>
              <div className="options">
                {quiz.questions[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-btn ${
                      userAnswers[currentQuestionIndex] === option ? 'selected' : ''
                    }`}
                    onClick={() => handleAnswerSelect(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="question-navigation">
              <button
                className="nav-btn"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <FaChevronLeft /> Previous
              </button>
              {currentQuestionIndex === quiz.questions.length - 1 ? (
                <button
                  className="submit-btn"
                  onClick={handleSubmitQuiz}
                  disabled={!userAnswers[currentQuestionIndex]}
                >
                  Submit
                </button>
              ) : (
                <button className="nav-btn" onClick={handleNextQuestion}>
                  Next <FaChevronRight />
                </button>
              )}
            </div>
          </div>

          <div className="stats-panel">
            <div className="timer-box">
              <span className="timer-label">Time Remaining:</span>
              <span className="timer-value">
                {remainingTime !== null ? formatTime(remainingTime) : '--:--'}
              </span>
            </div>
            <h4>Progress</h4>
            <p>Attempted: {attempted}</p>
            <p>Not Attempted: {notAttempted}</p>
            <p>Total: {quiz.questions.length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttemptQuiz;

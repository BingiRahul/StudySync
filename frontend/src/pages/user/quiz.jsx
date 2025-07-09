import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRandom, FaArrowLeft, FaHistory } from 'react-icons/fa';
import { useQuizContext } from '../context/quizContext';
import './quiz.css';

const Quizzes = () => {
  const {
    quizzes,
    loading,
    addQuizQuestion,
    fetchQuizzesByTopic,
  } = useQuizContext();

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    tags: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('option')) {
      const index = parseInt(name.split('-')[1]);
      const newOptions = [...formData.options];
      newOptions[index] = value;
      setFormData((prev) => ({ ...prev, options: newOptions }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.subject ||
      !formData.question ||
      formData.options.some((opt) => !opt) ||
      !formData.correctAnswer ||
      !formData.options.includes(formData.correctAnswer)
    ) {
      alert('Please fill all fields and ensure the correct answer is one of the options.');
      return;
    }
    await addQuizQuestion(formData);
    setFormData({
      title: '',
      subject: '',
      tags: '',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      subject: '',
      tags: '',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    });
    setIsModalOpen(false);
  };

  const handleTopicClick = async (topic) => {
    try {
      setLoadingQuizzes(true);
      const quizzesForTopic = await fetchQuizzesByTopic(topic._id);
      const topicWithQuizzes = {
        ...topic,
        quizzes: quizzesForTopic,
      };
      setSelectedTopic(topicWithQuizzes);
    } catch (error) {
      console.error(error);
      alert('Failed to load quizzes for this topic.');
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const handleQuizClick = (quiz) => {
    navigate(`/user/quizzes/attempt/${quiz._id}`);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
  };

  const handleRandomQuiz = () => {
    const allQuizzes = quizzes.flatMap((topic) => topic.quizzes || []);
    if (!allQuizzes.length) return;
    const randomQuiz = allQuizzes[Math.floor(Math.random() * allQuizzes.length)];
    navigate(`/user/quizzes/attempt/${randomQuiz._id}`);
  };

  const handleViewQuizAttempts = (quizId) => {
    navigate(`/user/quizzes/attempts/quiz/${quizId}`);
  };

  const filteredTopics = quizzes.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="quizzes-page">
      <div className="quizzes-container">
        {loading && <p>Loading quizzes...</p>}

        {!loading && !selectedTopic && (
          <>
            <div className="quizzes-header">
              <div className="title-group">
                <h2>My Quizzes</h2>
                <span>{quizzes.length} topics</span>
              </div>
              <div className="header-actions">
                <input
                  type="text"
                  placeholder="Search quizzes by topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-bar"
                />
                <button
                  className="upload-btn"
                  onClick={() => setIsModalOpen(true)}
                >
                  Add Quiz Question
                </button>
              </div>
            </div>

            <div className="quizzes-grid">
              {filteredTopics.map((topic) => (
                <div
                  className="quiz-card"
                  key={topic._id}
                  onClick={() => handleTopicClick(topic)}
                >
                  <div className="quiz-info">
                    <h4>{topic.title}</h4>
                    <p className="quiz-subject">{topic.subject}</p>
                    <p className="quiz-date">
                      {new Date(topic.createdAt).toLocaleDateString()}
                    </p>
                    <p className="quiz-count">
                      {topic.quizCount || 0} Quizzes
                    </p>
                    <p className="quiz-score">
                      Average Score: {topic.averageScore || 0}%
                    </p>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${topic.averageScore || 0}%` }}
                      ></div>
                    </div>
                    <div className="quiz-tags">
                      {topic.tags?.map((tag, i) => (
                        <span className="tag" key={i}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="quiz-actions">
                    <button
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTopicClick(topic);
                      }}
                    >
                      View Quizzes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && selectedTopic && (
          <div className="topic-view">
            <div className="topic-header">
              <div className="title-group">
                <h2>{selectedTopic.title}</h2>
                <span>{selectedTopic.quizzes?.length || 0} Quizzes</span>
              </div>
              <div className="header-actions">
                <button className="action-btn" onClick={handleRandomQuiz}>
                  <FaRandom /> Random Quiz
                </button>
                <button className="action-btn" onClick={handleBackToTopics}>
                  <FaArrowLeft /> Back to Topics
                </button>
              </div>
            </div>

            {loadingQuizzes && <p>Loading quizzes...</p>}

            <div className="quizzes-list">
              {selectedTopic.quizzes?.map((quiz) => (
                <div className="quiz-item" key={quiz._id}>
                  <div className="quiz-item-content">
                    <div className="quiz-item-info">
                      <h4>{quiz.title}</h4>
                      <p className="quiz-details">
                        {quiz.questions?.length || 0} Questions • ~
                        {quiz.estimatedTime || quiz.questions?.length || 0} min
                      </p>
                      <p className="quiz-score">
                        {quiz.lastScore
                          ? `Last Score: ${quiz.lastScore}%`
                          : 'Not attempted yet'}
                      </p>
                    </div>
                    <div className="quiz-actions vertical">
                      <button
                        className="action-btn"
                        onClick={() => handleQuizClick(quiz)}
                      >
                        Start Quiz
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => handleViewQuizAttempts(quiz._id)}
                      >
                        <FaHistory /> View Attempts
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {!selectedTopic.quizzes?.length && !loadingQuizzes && (
                <p>No quizzes found for this topic.</p>
              )}
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add New Quiz Question</h3>
              <div className="modal-form">
                <label>
                  Topic Title:
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter topic title"
                    required
                  />
                </label>
                <label>
                  Subject:
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Enter subject"
                    required
                  />
                </label>
                <label>
                  Tags (comma-separated, optional):
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g. calculus, derivatives"
                  />
                </label>
                <label>
                  Question:
                  <input
                    type="text"
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    placeholder="Enter question"
                    required
                  />
                </label>
                {formData.options.map((option, index) => (
                  <label key={index}>
                    Option {index + 1}:
                    <input
                      type="text"
                      name={`option-${index}`}
                      value={option}
                      onChange={handleInputChange}
                      placeholder={`Enter option ${index + 1}`}
                      required
                    />
                  </label>
                ))}
                <label>
                  Correct Answer:
                  <input
                    type="text"
                    name="correctAnswer"
                    value={formData.correctAnswer}
                    onChange={handleInputChange}
                    placeholder="Enter correct answer"
                    required
                  />
                </label>
                <div className="modal-actions">
                  <button
                    className="modal-btn submit-btn"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                  <button
                    className="modal-btn cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;

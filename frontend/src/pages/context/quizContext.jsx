import { createContext, useContext, useState, useEffect } from "react";
import * as quizService from "../../services/quizService";

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchAllTopics = async () => {
    setLoading(true);
    try {
      const topics = await quizService.fetchQuizTopics(token);
      setQuizzes(topics);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addQuizQuestion = async (formData) => {
    try {
      await quizService.createQuizQuestion(formData, token);
      await fetchAllTopics();
    } catch (e) {
      console.error(e);
      alert("Failed to add quiz question.");
    }
  };

  const fetchQuizzesByTopic = async (topicId) => {
    return await quizService.fetchQuizzesByTopic(topicId, token);
  };

  const getQuizById = async (quizId) => {
    return await quizService.fetchQuizById(quizId, token);
  };

  const recordQuizAttempt = async (quizId, score) => {
    return await quizService.recordQuizAttempt(quizId, score, token);
  };

  const getAttemptsByQuizId = async (quizId) => {
    return await quizService.getAttemptsByQuizId(quizId, token);
  };

  useEffect(() => {
    if (token) fetchAllTopics();
  }, [token]);

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        loading,
        addQuizQuestion,
        fetchQuizzesByTopic,
        getQuizById,
        recordQuizAttempt,
        getAttemptsByQuizId,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = () => useContext(QuizContext);

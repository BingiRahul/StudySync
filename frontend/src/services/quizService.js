import axios from "axios";

const BASE_URL = "http://localhost:5000/api/quizzes";

const axiosWithAuth = (token) =>
  axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const generateQuizFromNote = async (payload, token) => {
  return axiosWithAuth(token).post("/generate-from-note", payload);
};

export const createQuizQuestion = async (formData, token) => {
  const res = await axiosWithAuth(token).post("/question", formData);
  return res.data;
};

export const fetchQuizTopics = async (token) => {
  const res = await axiosWithAuth(token).get("/topics");
  return res.data;
};

export const fetchTopicById = async (topicId, token) => {
  const res = await axiosWithAuth(token).get(`/topic/${topicId}`);
  return res.data;
};

export const fetchQuizzesByTopic = async (topicId, token) => {
  const res = await axiosWithAuth(token).get(`/topic/${topicId}`);
  return res.data;
};

export const fetchQuizById = async (quizId, token) => {
  const res = await axiosWithAuth(token).get(`/${quizId}`);
  return res.data;
};

export const recordQuizAttempt = async (quizId, score, token) => {
  const res = await axiosWithAuth(token).post(`/attempt/${quizId}`, { score });
  return res.data;
};

export const getAttemptsByQuizId = async (quizId, token) => {
  const res = await axiosWithAuth(token).get(`/attempts/${quizId}`);
  return res.data;
};

// src/services/flashcardService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/flashcards";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllFlashcards = () => {
  return axios.get(API_URL, getAuthHeaders());
};

export const getFlashcardsByNote = (noteId) => {
  return axios.get(`${API_URL}/note/${noteId}`, getAuthHeaders());
};

export const updateCardStatus = (topicId, cardId, updates) => {
  return axios.patch(
    `${API_URL}/${topicId}/cards/${cardId}`,
    updates,
    getAuthHeaders()
  );
};

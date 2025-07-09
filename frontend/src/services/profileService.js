import axios from "axios";

const BASE_URL = "http://localhost:5000/api/profile";

export const fetchUserProfile = async (token) => {
  const res = await axios.get(`${BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateUserProfile = async (data, token) => {
  const res = await axios.put(`${BASE_URL}/me`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

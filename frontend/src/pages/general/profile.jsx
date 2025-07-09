import React, { useState, useEffect } from "react";
import "./profile.css";
import { fetchUserProfile, updateUserProfile } from "../../services/profileService";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const userData = await fetchUserProfile(token);
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email,
          password: "",
        });
        setLoading(false);
      } catch (e) {
        console.error(e);
        setError("Failed to load profile.");
        setLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updated = await updateUserProfile(formData, token);
      setUser(updated);
      setIsEditing(false);
      setLoading(false);
      alert("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page-wrapper">
        <div className="profile-card">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page-wrapper">
        <div className="profile-card">{error}</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page-wrapper">
      <div className="profile-card">
        <div className="profile-header">
          <div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="profile-field">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>

            <div className="profile-field">
              <label>Email account</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="youremail@gmail.com"
              />
            </div>

            <div className="profile-field">
              <label>Update Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </div>

            <button type="submit" className="profile-save-btn">
              Save Changes
            </button>
          </form>
        ) : (
          <div className="profile-view-mode">
            <div className="profile-field">
              <label>Name</label>
              <span>{user.name}</span>
            </div>

            <div className="profile-field">
              <label>Email account</label>
              <span>{user.email}</span>
            </div>

            <button className="profile-edit-btn" onClick={handleEditToggle}>
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

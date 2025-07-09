import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./notes.css";
import { FaDownload, FaEye } from "react-icons/fa";
import { useNoteContext } from "../context/noteContext";
import { generateSummaryPDF } from "../context/pdfUtils";

const NotesPage = () => {
  const navigate = useNavigate();
  const {
    notes,
    loading,
    error,
    addNote,
  } = useNoteContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    document: null,
    images: [],
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "document") {
      setFormData((prev) => ({ ...prev, document: files[0] || null }));
    } else if (name === "images") {
      setFormData((prev) => ({ ...prev, images: Array.from(files) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("subject", formData.subject);
    payload.append("description", formData.description);
    if (formData.document) {
      payload.append("document", formData.document);
    }
    formData.images.forEach((file) => {
      payload.append("images", file);
    });

    try {
      await addNote(payload);
      alert("Note uploaded successfully!");
      setFormData({
        title: "",
        subject: "",
        description: "",
        document: null,
        images: [],
      });
      setIsModalOpen(false);
    } catch (err) {
      alert("Error uploading note");
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      subject: "",
      description: "",
      document: null,
      images: [],
    });
    setIsModalOpen(false);
  };

  const handleViewNote = (note) => {
    navigate(`/user/note/${note._id}`);
  };

  const handleDownload = (note) => {
    generateSummaryPDF(note);
  };

  return (
    <div className="notes-page">
      <div className="notes-header">
        <div className="title-group">
          <h2>My Notes Library</h2>
          <span>{notes?.length || 0} notes</span>
        </div>
        <button className="upload-btn" onClick={() => setIsModalOpen(true)}>
          Upload Note
        </button>
      </div>

      {loading && <p>Loading notes...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="notes-grid">
        {notes.map((note) => (
          <div className="note-card" key={note._id}>
            <div className="note-info">
              <h4>{note.title}</h4>
              <p className="note-subject">{note.subject}</p>
              <p className="note-date">
                {new Date(note.createdAt).toLocaleDateString()}
              </p>
              <p className="note-size">
                {note.document ? note.document.split("/").pop() : "No document"}
              </p>
              <div className="note-tags">
                {note.aiTags?.map((tag, i) => (
                  <span className="tag" key={i}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="note-actions">
              <button
                className="action-btn"
                onClick={() => handleViewNote(note)}
              >
                <FaEye /> View
              </button>
              {note.aiSummary && note.aiSummary.length > 0 && (
                <button
                  className="action-btn"
                  onClick={() => handleDownload(note)}
                >
                  <FaDownload /> Download Summary
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Upload New Note</h3>
            <div className="modal-form">
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
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
                  required
                />
              </label>
              <label>
                Description (Optional):
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                />
              </label>
              <label>
                Document (Optional):
                <input
                  type="file"
                  name="document"
                  onChange={handleInputChange}
                  accept=".pdf,.doc,.docx,.txt"
                />
              </label>
              <label>
                Images (Optional):
                <input
                  type="file"
                  name="images"
                  onChange={handleInputChange}
                  accept="image/*"
                  multiple
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
  );
};

export default NotesPage;

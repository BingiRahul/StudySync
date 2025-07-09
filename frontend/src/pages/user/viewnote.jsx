import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./viewnote.css";
import {
  FaDownload,
  FaEye,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaQuestionCircle,
} from "react-icons/fa";
import { useNoteContext } from "../context/noteContext";
import { generateQuizFromNote } from "../../services/quizService";

const BACKEND_BASE_URL = "http://localhost:5000";

const ViewNotePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchNoteById, removeNote } = useNoteContext();

  const [note, setNote] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const data = await fetchNoteById(id);
        setNote(data);
      } catch (error) {
        console.error(error);
        navigate("/user/my-notes");
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id, navigate, fetchNoteById]);

  if (loading) return <p>Loading note...</p>;
  if (!note) return <p>Note not found.</p>;

  const token = localStorage.getItem("token");

  const handleEdit = () => {
    navigate(`/user/note/${note._id}/edit`, {
      state: { note, authToken: token },
    });
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await removeNote(note._id);
      alert("Note deleted.");
      navigate("/user/my-notes");
    } catch (err) {
      console.error(err);
      alert("Error deleting note");
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleBack = () => {
    navigate("/user/my-notes");
  };

  const handleImageClick = (imageUrl) => {
    setEnlargedImage(imageUrl);
  };

  const handleCloseImage = () => {
    setEnlargedImage(null);
  };

  const handleViewDocument = () => {
    const url = `${BACKEND_BASE_URL}${note.document}`;
    window.open(url, "_blank");
  };

  const handleGenerateQuiz = async () => {
  try {
    const noteContent = [
      note.description,
      ...(note.aiSummary || []),
    ]
      .filter(Boolean)
      .join("\n");

    const payload = {
      noteId: note._id,
      title: note.title,
      subject: note.subject,
      tags: note.aiTags || [],
      content: noteContent,
    };

    const token = localStorage.getItem("token");

    await generateQuizFromNote(payload, token);
    alert("Quiz generated successfully!");
    navigate("/user/quizzes");
  } catch (err) {
    console.error(err);
    alert(err?.response?.data?.message || "Failed to generate quiz.");
  }
};



  const documentUrl = note.document
    ? `${BACKEND_BASE_URL}${note.document}`
    : null;

  const imageUrls = note.images?.length
    ? note.images.map((img) => `${BACKEND_BASE_URL}${img}`)
    : [];

  return (
    <div className="note-page">
      <div className="note-container">
        <div className="note-header">
          <h1 className="note-title">{note.title}</h1>
          <div className="note-meta">
            <span>Added on: {new Date(note.createdAt).toLocaleDateString()}</span>
            <span>Subject: {note.subject}</span>
          </div>
          {note.aiTags && note.aiTags.length > 0 && (
            <div className="note-tags">
              {note.aiTags.map((tag, i) => (
                <span className="tag" key={i}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {note.description && (
          <div className="note-section">
            <h2>Description</h2>
            <div className="note-description">{note.description}</div>
          </div>
        )}

        {documentUrl && (
          <div className="note-section">
            <h2>Document</h2>
            <div className="document-actions">
              <a href={documentUrl} className="action-btn" download>
                <FaDownload /> Download Document
              </a>
              <button className="action-btn" onClick={handleViewDocument}>
                <FaEye /> View Document
              </button>
            </div>
          </div>
        )}

        {imageUrls.length > 0 && (
          <div className="note-section">
            <h2>Images</h2>
            <div className="note-images">
              {imageUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Note ${i + 1}`}
                  className="note-image"
                  onClick={() => handleImageClick(url)}
                />
              ))}
            </div>
          </div>
        )}

        {note.aiSummary && note.aiSummary.length > 0 && (
          <div className="note-section">
            <h2>Summary</h2>
            <ol className="note-summary">
              {note.aiSummary.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ol>
          </div>
        )}

        {note.aiQuestions && note.aiQuestions.length > 0 && (
          <div className="note-section">
            <h2>Practice Questions</h2>
            <ol className="note-questions">
              {note.aiQuestions.map((question, i) => (
                <li key={i}>{question}</li>
              ))}
            </ol>
          </div>
        )}

        <div className="note-actions">
          <button className="action-btn" onClick={handleBack}>
            <FaArrowLeft /> Back to Notes
          </button>
          <button className="action-btn" onClick={handleGenerateQuiz}>
            <FaQuestionCircle /> Generate Quiz
          </button>
          <button className="action-btn" onClick={handleEdit}>
            <FaEdit /> Edit
          </button>
          <button className="action-btn delete-btn" onClick={handleDelete}>
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      {enlargedImage && (
        <div className="image-modal-overlay" onClick={handleCloseImage}>
          <div className="image-modal-content">
            <img
              src={enlargedImage}
              alt="Enlarged note"
              className="enlarged-image"
            />
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>
              Are you sure you want to delete "{note.title}"? This action
              cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="modal-btn confirm-btn"
                onClick={confirmDelete}
              >
                Delete
              </button>
              <button
                className="modal-btn cancel-btn"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewNotePage;

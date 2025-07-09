import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./editnote.css";
import { FaArrowLeft, FaSave, FaEye } from "react-icons/fa";
import { regenerateSummary, regenerateTags } from "../../services/noteService";

const EditNotePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { note, authToken } = location.state || {};

  // get token either from state or localStorage
  const token = authToken || localStorage.getItem("token");

  const [editedNote, setEditedNote] = useState(
    note
      ? {
          ...note,
          documentUrl: note.document || null,
          imagesUrls: note.images || [],
        }
      : {}
  );

  const [newDocument, setNewDocument] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [showRegeneratePrompt, setShowRegeneratePrompt] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [regenType, setRegenType] = useState(null);
  const [regenQuery, setRegenQuery] = useState("");

  if (!note) {
    navigate("/user/my-notes");
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedNote((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDocument(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const handleRemoveDocument = () => {
    setEditedNote((prev) => ({ ...prev, documentUrl: null }));
    setNewDocument(null);
  };

  const handleRemoveImage = (index) => {
    setEditedNote((prev) => ({
      ...prev,
      imagesUrls: prev.imagesUrls.filter((_, i) => i !== index),
    }));
  };

  const handleViewDocument = () => {
    if (newDocument) {
      window.open(newDocument, "_blank");
    } else if (editedNote.documentUrl) {
      const fullUrl = editedNote.documentUrl.startsWith("http")
        ? editedNote.documentUrl
        : `http://localhost:5000${editedNote.documentUrl}`;
      window.open(fullUrl, "_blank");
    }
  };

  const handleImageClick = (imageUrl) => {
    setEnlargedImage(imageUrl);
  };

  const handleCloseImage = () => {
    setEnlargedImage(null);
  };

  const handleSaveChanges = () => {
    const isContentChanged =
      editedNote.noteText !== note.noteText ||
      editedNote.documentUrl !== (note.document || null) ||
      JSON.stringify(editedNote.imagesUrls) !== JSON.stringify(note.images || []) ||
      newDocument ||
      newImages.length > 0;

    if (isContentChanged) {
      setShowRegeneratePrompt(true);
    } else {
      navigate(`/user/note/${note._id}`, { state: { note: editedNote, authToken: token } });
    }
  };

  const handleRegenerateConfirm = () => {
    setShowRegeneratePrompt(false);
    navigate(`/user/note/${note._id}`, { state: { note: editedNote, authToken: token } });
  };

  const handleRegenerateCancel = () => {
    setShowRegeneratePrompt(false);
    navigate(`/user/note/${note._id}`, { state: { note: editedNote, authToken: token } });
  };

  const handleRegenerateSummary = () => {
    setRegenType("summary");
    setRegenQuery("");
  };

  const handleRegenerateTags = () => {
    setRegenType("tags");
    setRegenQuery("");
  };

  const handleCancelEdit = () => {
    navigate(`/user/note/${note._id}`, { state: { note, authToken: token } });
  };

  const handleConfirmRegenerate = async () => {
    try {
      const combinedText =
        (editedNote.description && editedNote.description.trim().length > 0)
          ? editedNote.description
          : (note.description && note.description.trim().length > 0)
            ? note.description
            : (note.noteText && note.noteText.trim().length > 0)
              ? note.noteText
              : (note.aiSummary && note.aiSummary.length > 0)
                ? note.aiSummary.join(" ")
                : "";

      if (regenType === "summary") {
        const result = await regenerateSummary(
          note._id,
          {
            textToSummarize: combinedText,
            instructions: regenQuery,
          },
          token
        );
        setEditedNote((prev) => ({
          ...prev,
          aiSummary: result.aiSummary || [],
        }));
      } else if (regenType === "tags") {
        const result = await regenerateTags(
          note._id,
          {
            textToSummarize: combinedText,
            instructions: regenQuery,
          },
          token
        );
        setEditedNote((prev) => ({
          ...prev,
          aiTags: result.aiTags || [],
        }));
      }
      setRegenType(null);
    } catch (err) {
      console.error(err);
      alert(`Failed to regenerate ${regenType}.`);
      setRegenType(null);
    }
  };

  const handleCancelRegenerate = () => {
    setRegenType(null);
  };

  return (
    <div className="edit-note-page">
      <div className="edit-note-container">
        <h1 className="edit-note-title">Edit Note</h1>
        <div className="edit-form">
          <div className="form-field">
            <label>
              Title
              <input
                type="text"
                name="title"
                value={editedNote.title || ""}
                onChange={handleInputChange}
                className="edit-input"
              />
            </label>
          </div>
          <div className="form-field">
            <label>
              Subject
              <input
                type="text"
                name="subject"
                value={editedNote.subject || ""}
                onChange={handleInputChange}
                className="edit-input"
              />
            </label>
          </div>

          {editedNote.noteText && (
            <div className="form-field">
              <label>
                Note Text
                <textarea
                  name="noteText"
                  value={editedNote.noteText}
                  onChange={handleInputChange}
                  className="edit-textarea"
                />
              </label>
            </div>
          )}

          {editedNote.aiSummary && editedNote.aiSummary.length > 0 && (
            <div className="ai-summary-preview">
              <h3>Generated AI Summary</h3>
              <ul>
                {editedNote.aiSummary.map((chunk, idx) => (
                  <li key={idx}>{chunk}</li>
                ))}
              </ul>
            </div>
          )}

          {editedNote.aiTags && editedNote.aiTags.length > 0 && (
            <div className="ai-tags-preview">
              <h3>Generated AI Tags</h3>
              <div className="tag-list">
                {editedNote.aiTags.map((tag, i) => (
                  <span className="tag-badge" key={i}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="form-field">
            <label>
              Document
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleDocumentChange}
                className="edit-file-input"
              />
              {(editedNote.documentUrl || newDocument) && (
                <div className="file-preview">
                  <span>{newDocument ? "New Document Selected" : "Current Document"}</span>
                  <div className="file-actions">
                    <button className="view-file-btn" onClick={handleViewDocument}>
                      <FaEye /> View Document
                    </button>
                    <button className="remove-file-btn" onClick={handleRemoveDocument}>
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </label>
          </div>

          <div className="form-field">
            <label>
              Images
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="edit-file-input"
              />
              <div className="file-preview">
                {editedNote.imagesUrls &&
                  editedNote.imagesUrls.map((url, i) => (
                    <div key={i} className="image-preview-item">
                      <img
                        src={url}
                        alt={`Current ${i + 1}`}
                        className="preview-image"
                        onClick={() => handleImageClick(url)}
                      />
                      <button
                        className="remove-file-btn"
                        onClick={() => handleRemoveImage(i)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                {newImages.map((url, i) => (
                  <div key={`new-${i}`} className="image-preview-item">
                    <img
                      src={url}
                      alt={`New ${i + 1}`}
                      className="preview-image"
                      onClick={() => handleImageClick(url)}
                    />
                  </div>
                ))}
              </div>
            </label>
          </div>

          <div className="regen-buttons">
            <button className="regen-btn" onClick={handleRegenerateSummary}>
              Regenerate Summary
            </button>
            <button className="regen-btn" onClick={handleRegenerateTags}>
              Regenerate Tags
            </button>
          </div>

          <div className="edit-actions">
            <button className="action-btn" onClick={handleCancelEdit}>
              <FaArrowLeft /> Cancel
            </button>
            <button className="action-btn save-btn" onClick={handleSaveChanges}>
              <FaSave /> Save Changes
            </button>
          </div>
        </div>
      </div>

      {enlargedImage && (
        <div className="image-modal-overlay" onClick={handleCloseImage}>
          <div className="image-modal-content">
            <img src={enlargedImage} alt="Enlarged note" className="enlarged-image" />
          </div>
        </div>
      )}

      {showRegeneratePrompt && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Regenerate AI Content</h3>
            <p>
              Your note content has changed. Do you want to regenerate the summary,
              tags, and questions?
            </p>
            <div className="modal-actions">
              <button className="modal-btn confirm-btn" onClick={handleRegenerateConfirm}>
                Yes
              </button>
              <button className="modal-btn cancel-btn" onClick={handleRegenerateCancel}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {regenType && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Regenerate {regenType === "summary" ? "Summary" : "Tags"}</h3>
            <p>Enter instructions for how the AI should regenerate:</p>
            <textarea
              value={regenQuery}
              onChange={(e) => setRegenQuery(e.target.value)}
              placeholder="E.g. Summarize for 10-year-olds, or focus on legal terms..."
              className="regen-query-input"
            ></textarea>
            <div className="modal-actions">
              <button className="modal-btn confirm-btn" onClick={handleConfirmRegenerate}>
                Confirm
              </button>
              <button className="modal-btn cancel-btn" onClick={handleCancelRegenerate}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditNotePage;

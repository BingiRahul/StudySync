import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createNote,
  getNotes,
  getNoteById,
  deleteNote,
} from "../../services/noteService";

const NoteContext = createContext();

export const useNoteContext = () => useContext(NoteContext);

const NoteProvider = ({ children, authToken }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all notes initially
  useEffect(() => {
    if (authToken) {
      fetchNotes();
    }
  }, [authToken]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await getNotes(authToken);
      setNotes(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (formData) => {
    try {
      setLoading(true);
      const newNote = await createNote(formData, authToken);
      setNotes((prev) => [...prev, newNote]);
      return newNote;
    } catch (err) {
      console.error(err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeNote = async (id) => {
    try {
      setLoading(true);
      await deleteNote(id, authToken);
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchNoteById = async (id) => {
    try {
      setLoading(true);
      const note = await getNoteById(id, authToken);
      return note;
    } catch (err) {
      console.error(err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        loading,
        error,
        addNote,
        removeNote,
        fetchNotes,
        fetchNoteById,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export default NoteProvider;

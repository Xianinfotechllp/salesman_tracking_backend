const {
  createNote,
  getAllNotes,
  getNoteById,
  getNotesBySalesman,
  updateNote,
  deleteNote,
} = require("../services/notes.service");
const ApiError = require("../utils/ApiError");
const errorHandler = require("../utils/errorHandler");
const User = require("../models/users");

const handleCreateNote = async (req, res) => {
  try {
    const noteData = req.body;
    console.log(req.body);
    const note = await createNote(noteData);
    res.status(201).json(note);
  } catch (error) {
    errorHandler(error, res);
  }
};

const handleGetAllNotes = async (req, res) => {
  try {
    const notes = await getAllNotes();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: `Error fetching notes: ${error.message}` });
  }
};

const handleGetNoteById = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await getNoteById(noteId);

    res.status(200).json(note);
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error(error);

    res.status(500).json({ message: "Something went wrong!" });
  }
};

const handleGetAllNotesBySalesmanId = async (req, res) => {
  try {
    const { salesmanId } = req.params;
    const notes = await getNotesBySalesman(salesmanId);

    if (!notes.length) {
      return res
        .status(404)
        .json({ message: "No notes found for this salesman" });
    }

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: `Error fetching notes: ${error.message}` });
  }
};

const handleUpdateNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const noteData = req.body;
    const updatedNote = await updateNote(noteId, noteData);
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: `Error updating note: ${error.message}` });
  }
};


const handleDeleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const deletedNote = await deleteNote(noteId);

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    res.status(500).json({ message: `Error deleting note: ${error.message}` });
  }
};


module.exports = {
  handleCreateNote,
  handleGetAllNotes,
  handleGetNoteById,
  handleGetAllNotesBySalesmanId,
  handleUpdateNote,
  handleDeleteNote,
};

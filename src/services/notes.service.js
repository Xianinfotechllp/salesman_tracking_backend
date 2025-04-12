const { validateNote } = require("../utils/validator");
const GenericRepo = require("../repository/genericRepository");
const Note = require("../models/notes");
const ApiError = require("../utils/ApiError");
const User = require("../models/users");

const createNote = async (noteData) => {
  try {
    const { error, value } = validateNote(noteData);
    if (error) {
      throw new ApiError(400, error.message);
    }
    const { salesman } = value;

    const userExists = await User.findById(salesman);
    if (!userExists) {
      throw new ApiError(404, "Salesman not found");
    }

    return await GenericRepo.create(Note, value);
  } catch (error) {
    throw error;
  }
};

const getAllNotes = async () => {
  try {
    return await GenericRepo.getAll(Note, ["salesman"]);
  } catch (error) {
    throw new Error(`Error fetching notes: ${error.message}`);
  }
};

const getNoteById = async (noteId) => {
  try {
    return await Note.findById(noteId);
  } catch (error) {
    throw new Error(`Error fetching note by ID: ${error.message}`);
  }
};

const getNotesBySalesman = async (salesmanId) => {
  try {
    return await Note.find({ salesman: salesmanId })
      .populate("salesman")
      .sort({ createdAt: -1 })
      .lean();
  } catch (error) {
    throw new Error(`Error fetching notes by salesman: ${error.message}`);
  }
};

const updateNote = async (id, noteData) => {
  try {
    
    const { error, value } = validateNote(noteData);
    if (error) {
      throw new ApiError(400, error.message);
    }

    
    return await GenericRepo.update(Note, id, noteData);
  } catch (error) {
    console.error("Error in updateNote:", error); 
    throw error;
  }
};

const deleteNote = async (id) => {
  return await GenericRepo.remove(Note, id);
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  getNotesBySalesman,
  updateNote,
  deleteNote,
};

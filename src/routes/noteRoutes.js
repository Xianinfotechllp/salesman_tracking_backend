const express = require('express');
const router = express.Router();
const { 
  handleCreateNote, 
  handleGetAllNotes, 
  handleGetNoteById, 
  handleGetAllNotesBySalesmanId,
  handleUpdateNote, 
  handleDeleteNote 
} = require('../controllers/notes.controller');

router.post('/', handleCreateNote);
router.get('/', handleGetAllNotes);
router.get('/getNote/:id', handleGetNoteById);
router.get('/salesman/all/:salesmanId',handleGetAllNotesBySalesmanId)
router.put('/:id', handleUpdateNote);
router.delete('/:id', handleDeleteNote);

module.exports = router;

import express from 'express';
import notesController from '../controllers/notes.controller.js';

const router = express.Router();

router.get('/', notesController.getNotes);
router.get('/:_id', notesController.getNote);
router.post('/', notesController.addNote);
router.post('/addnotes', notesController.addNotes);
router.put('/', notesController.updateNote);
router.delete('/:_id', notesController.deleteNote);
router.delete('/delete/all', notesController.deleteAll);

export default {router};
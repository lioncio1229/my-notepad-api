import express from 'express';
import notesController from '../controllers/notes.controller.js';

const router = express.Router();

router.get('/', notesController.getNotes);
router.get('/:_id', notesController.getNote);
router.post('/', notesController.addNote);
router.delete('/', notesController.deleteNote);
router.put('/', notesController.updateNote);

export default {router};
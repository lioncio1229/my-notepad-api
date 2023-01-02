import express from 'express';
import usersController from '../controllers/users.controller.js';

const router = express.Router();

router.get('/', usersController.getUser);
router.post('/', usersController.upsetUser);
router.delete('/:_id', usersController.deleteUser);
router.delete('/', usersController.deleteAll);

export default {router};
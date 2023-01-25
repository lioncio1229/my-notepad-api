import express from 'express';
import oauthController from '../controllers/oauth.controller.js';

const router = express.Router();

router.post('/', oauthController.authenticate);

export default {router};
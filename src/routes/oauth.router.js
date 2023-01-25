import express from 'express';
import oauthController from '../controllers/oauth.controller.js';

const router = express.Router();

router.post('/auth', oauthController.authenticate);
router.post('/validation', oauthController.validateToken);

export default {router};
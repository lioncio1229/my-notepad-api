import express from 'express';
import oauthController from '../controllers/oauth.controller.js';

const router = express.Router();

router.post('/auth', oauthController.authenticate);
router.post('/newTokenId', oauthController.generateTokenId);

export default {router};
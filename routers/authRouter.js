import express from 'express';
import { getLoginPage, login, logout , getHomePage } from '../controllers/authController.js';

const router = express.Router();
router.get('/' , getHomePage);
router.get('/login', getLoginPage);
router.post('/login', login);
router.get('/logout', logout);

export default router;

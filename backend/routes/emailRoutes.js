import express from 'express';
import { sendCalculationEmail } from '../controllers/emailController.js';

const router = express.Router();

router.post('/send-email', sendCalculationEmail);

export default router;
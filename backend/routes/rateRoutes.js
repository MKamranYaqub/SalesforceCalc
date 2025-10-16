import express from 'express';
import { getConfiguration } from '../controllers/rateController.js';

const router = express.Router();

router.get('/configuration', getConfiguration);

export default router;
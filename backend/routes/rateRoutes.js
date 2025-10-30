import express from 'express';
import { getConfiguration, listRates, upsertRates, updateRate, deleteRate } from '../controllers/rateController.js';

const router = express.Router();

router.get('/configuration', getConfiguration);

// Admin endpoints for rates
router.get('/rates/list', listRates);
router.post('/rates/upsert', upsertRates);
router.put('/rates/:id', updateRate);
router.delete('/rates/:id', deleteRate);

export default router;
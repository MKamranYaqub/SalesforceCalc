import express from 'express';
import { saveCalculation, getCase, updateCaseStatus, updateCalculation } from '../controllers/caseController.js';

const router = express.Router();

// PUT must come BEFORE the GET route to avoid conflicts
router.put('/:reference', updateCalculation);
router.post('/', saveCalculation);
router.get('/:reference', getCase);
router.patch('/:reference/status', updateCaseStatus);

export default router;
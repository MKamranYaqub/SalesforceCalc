import express from 'express';
import { saveCalculation, getCase, updateCaseStatus } from '../controllers/caseController.js';

const router = express.Router();

router.post('/', saveCalculation);
router.get('/:reference', getCase);
router.patch('/:reference/status', updateCaseStatus);

export default router;
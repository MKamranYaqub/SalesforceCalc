import express from 'express';
import { saveCalculation, getCase, updateCaseStatus, updateCalculation } from '../controllers/caseController.js';

const router = express.Router();

router.post('/', saveCalculation);
router.get('/:reference', getCase);
router.patch('/:reference/status', updateCaseStatus);
router.put('/:reference', updateCalculation);

export default router;
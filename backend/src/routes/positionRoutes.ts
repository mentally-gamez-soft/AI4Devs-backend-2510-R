import { Router } from 'express';
import { getCandidatesByPositionController } from '../presentation/controllers/positionController';

const router = Router();

// GET /positions/:id/candidates - Get all candidates for a position
router.get('/:id/candidates', getCandidatesByPositionController);

export default router;

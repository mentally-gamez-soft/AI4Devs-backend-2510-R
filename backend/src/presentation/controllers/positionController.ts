import { Request, Response } from 'express';
import { getCandidatesByPosition } from '../../application/services/positionService';

/**
 * Controller to get all candidates for a specific position
 * GET /positions/:id/candidates
 */
export const getCandidatesByPositionController = async (req: Request, res: Response) => {
    try {
        const positionId = parseInt(req.params.id);
        
        // Validate ID format
        if (isNaN(positionId)) {
            return res.status(400).json({ 
                error: 'Invalid ID format',
                message: 'Position ID must be a valid number' 
            });
        }

        // Get candidates for the position using the shared Prisma client
        const candidates = await getCandidatesByPosition(positionId, req.prisma);

        // Handle position not found
        if (candidates === null) {
            return res.status(404).json({ 
                error: 'Position not found',
                message: `No position found with ID ${positionId}` 
            });
        }

        // Return successful response
        res.status(200).json({
            positionId: positionId,
            candidatesCount: candidates.length,
            candidates: candidates
        });
    } catch (error) {
        console.error('Error in getCandidatesByPositionController:', error);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: 'An unexpected error occurred while retrieving candidates' 
        });
    }
};

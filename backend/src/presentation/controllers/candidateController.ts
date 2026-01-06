import { Request, Response } from 'express';
import { addCandidate, findCandidateById, updateCandidateStage } from '../../application/services/candidateService';

export const addCandidateController = async (req: Request, res: Response) => {
    try {
        const candidateData = req.body;
        const candidate = await addCandidate(candidateData);
        res.status(201).json({ message: 'Candidate added successfully', data: candidate });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Error adding candidate', error: error.message });
        } else {
            res.status(400).json({ message: 'Error adding candidate', error: 'Unknown error' });
        }
    }
};

export const getCandidateById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const candidate = await findCandidateById(id);
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Controller to update a candidate's interview stage
 * PUT /candidates/:id/stage
 */
export const updateCandidateStageController = async (req: Request, res: Response) => {
    try {
        const candidateId = parseInt(req.params.id);
        
        // Validate candidate ID format
        if (isNaN(candidateId)) {
            return res.status(400).json({ 
                error: 'Invalid ID format',
                message: 'Candidate ID must be a valid number' 
            });
        }

        // Validate request body
        const { interviewStepId } = req.body;
        
        if (!interviewStepId) {
            return res.status(400).json({ 
                error: 'Missing required field',
                message: 'interviewStepId is required in request body' 
            });
        }

        const interviewStepIdNum = parseInt(interviewStepId);
        
        if (isNaN(interviewStepIdNum)) {
            return res.status(400).json({ 
                error: 'Invalid interview step ID',
                message: 'interviewStepId must be a valid number' 
            });
        }

        // Update the candidate's stage
        const updatedApplication = await updateCandidateStage(candidateId, interviewStepIdNum);

        // Handle candidate not found
        if (updatedApplication === null) {
            return res.status(404).json({ 
                error: 'Candidate not found',
                message: `No candidate found with ID ${candidateId}` 
            });
        }

        // Return successful response
        res.status(200).json({
            message: 'Candidate stage updated successfully',
            data: updatedApplication
        });
    } catch (error: any) {
        console.error('Error in updateCandidateStageController:', error);
        
        // Handle specific error cases
        if (error.message === 'Interview step not found') {
            return res.status(400).json({ 
                error: 'Invalid interview step',
                message: 'The specified interview step does not exist' 
            });
        }
        
        if (error.message === 'No application found for this candidate') {
            return res.status(400).json({ 
                error: 'No application found',
                message: 'This candidate has no applications to update' 
            });
        }

        res.status(500).json({ 
            error: 'Internal Server Error',
            message: 'An unexpected error occurred while updating candidate stage' 
        });
    }
};

export { addCandidate };
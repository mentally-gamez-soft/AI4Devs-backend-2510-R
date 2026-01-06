import { PrismaClient } from '@prisma/client';
import { updateCandidateStage } from '../../application/services/candidateService';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        candidate: {
            findUnique: jest.fn(),
        },
        interviewStep: {
            findUnique: jest.fn(),
        },
        application: {
            findFirst: jest.fn(),
            update: jest.fn(),
        },
    };
    return {
        PrismaClient: jest.fn(() => mockPrisma),
    };
});

const prisma = new PrismaClient();

describe('Candidate Service - updateCandidateStage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return null when candidate does not exist', async () => {
        (prisma.candidate.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await updateCandidateStage(999, 1);

        expect(result).toBeNull();
        expect(prisma.candidate.findUnique).toHaveBeenCalledWith({
            where: { id: 999 }
        });
    });

    it('should throw error when interview step does not exist', async () => {
        (prisma.candidate.findUnique as jest.Mock).mockResolvedValue({ id: 1, firstName: 'John' });
        (prisma.interviewStep.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(updateCandidateStage(1, 999)).rejects.toThrow('Interview step not found');
    });

    it('should throw error when candidate has no applications', async () => {
        (prisma.candidate.findUnique as jest.Mock).mockResolvedValue({ id: 1, firstName: 'John' });
        (prisma.interviewStep.findUnique as jest.Mock).mockResolvedValue({ id: 1, name: 'Phone Screen' });
        (prisma.application.findFirst as jest.Mock).mockResolvedValue(null);

        await expect(updateCandidateStage(1, 1)).rejects.toThrow('No application found for this candidate');
    });

    it('should successfully update candidate stage with valid inputs', async () => {
        const mockCandidate = { id: 1, firstName: 'John', lastName: 'Doe' };
        const mockInterviewStep = { id: 2, name: 'Technical Interview' };
        const mockApplication = { id: 1, candidateId: 1, currentInterviewStep: 1 };
        const mockUpdatedApplication = {
            id: 1,
            candidateId: 1,
            currentInterviewStep: 2,
            candidate: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com'
            },
            interviewStep: {
                name: 'Technical Interview',
                orderIndex: 2
            },
            position: {
                title: 'Software Engineer'
            }
        };

        (prisma.candidate.findUnique as jest.Mock).mockResolvedValue(mockCandidate);
        (prisma.interviewStep.findUnique as jest.Mock).mockResolvedValue(mockInterviewStep);
        (prisma.application.findFirst as jest.Mock).mockResolvedValue(mockApplication);
        (prisma.application.update as jest.Mock).mockResolvedValue(mockUpdatedApplication);

        const result = await updateCandidateStage(1, 2);

        expect(result).toEqual(mockUpdatedApplication);
        expect(prisma.application.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { currentInterviewStep: 2 },
            include: expect.any(Object)
        });
    });

    it('should return updated application data with correct structure', async () => {
        const mockCandidate = { id: 1, firstName: 'Jane', lastName: 'Smith' };
        const mockInterviewStep = { id: 3, name: 'Final Interview' };
        const mockApplication = { id: 2, candidateId: 1, currentInterviewStep: 2 };
        const mockUpdatedApplication = {
            id: 2,
            candidateId: 1,
            currentInterviewStep: 3,
            candidate: {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane@example.com'
            },
            interviewStep: {
                name: 'Final Interview',
                orderIndex: 3
            },
            position: {
                title: 'Product Manager'
            }
        };

        (prisma.candidate.findUnique as jest.Mock).mockResolvedValue(mockCandidate);
        (prisma.interviewStep.findUnique as jest.Mock).mockResolvedValue(mockInterviewStep);
        (prisma.application.findFirst as jest.Mock).mockResolvedValue(mockApplication);
        (prisma.application.update as jest.Mock).mockResolvedValue(mockUpdatedApplication);

        const result = await updateCandidateStage(1, 3);

        expect(result).toHaveProperty('candidate');
        expect(result).toHaveProperty('interviewStep');
        expect(result).toHaveProperty('position');
        expect(result?.candidate.firstName).toBe('Jane');
        expect(result?.interviewStep.name).toBe('Final Interview');
    });

    it('should update the most recent application when candidate has multiple applications', async () => {
        const mockCandidate = { id: 1, firstName: 'Bob', lastName: 'Johnson' };
        const mockInterviewStep = { id: 2, name: 'Technical Interview' };
        const mockMostRecentApplication = { 
            id: 5, 
            candidateId: 1, 
            applicationDate: new Date('2024-01-15'),
            currentInterviewStep: 1 
        };
        const mockUpdatedApplication = {
            id: 5,
            candidateId: 1,
            currentInterviewStep: 2,
            candidate: { firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com' },
            interviewStep: { name: 'Technical Interview', orderIndex: 2 },
            position: { title: 'Data Scientist' }
        };

        (prisma.candidate.findUnique as jest.Mock).mockResolvedValue(mockCandidate);
        (prisma.interviewStep.findUnique as jest.Mock).mockResolvedValue(mockInterviewStep);
        (prisma.application.findFirst as jest.Mock).mockResolvedValue(mockMostRecentApplication);
        (prisma.application.update as jest.Mock).mockResolvedValue(mockUpdatedApplication);

        const result = await updateCandidateStage(1, 2);

        expect(prisma.application.findFirst).toHaveBeenCalledWith({
            where: { candidateId: 1 },
            orderBy: { applicationDate: 'desc' }
        });
        expect(result?.id).toBe(5);
    });

    it('should handle database errors appropriately', async () => {
        (prisma.candidate.findUnique as jest.Mock).mockRejectedValue(new Error('Database connection error'));

        await expect(updateCandidateStage(1, 1)).rejects.toThrow('Database connection error');
    });

    it('should validate that interview step ID is valid', async () => {
        const mockCandidate = { id: 1, firstName: 'Alice', lastName: 'Brown' };
        
        (prisma.candidate.findUnique as jest.Mock).mockResolvedValue(mockCandidate);
        (prisma.interviewStep.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(updateCandidateStage(1, -1)).rejects.toThrow('Interview step not found');
    });
});

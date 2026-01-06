import { PrismaClient } from '@prisma/client';
import { getCandidatesByPosition } from '../../application/services/positionService';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
    const mockPrisma = {
        position: {
            findUnique: jest.fn(),
        },
        application: {
            findMany: jest.fn(),
        },
    };
    return {
        PrismaClient: jest.fn(() => mockPrisma),
    };
});

const prisma = new PrismaClient();

describe('Position Service - getCandidatesByPosition', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return null when position does not exist', async () => {
        (prisma.position.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await getCandidatesByPosition(999, prisma);

        expect(result).toBeNull();
        expect(prisma.position.findUnique).toHaveBeenCalledWith({
            where: { id: 999 }
        });
    });

    it('should return empty array when position has no candidates', async () => {
        (prisma.position.findUnique as jest.Mock).mockResolvedValue({ id: 1, title: 'Test Position' });
        (prisma.application.findMany as jest.Mock).mockResolvedValue([]);

        const result = await getCandidatesByPosition(1, prisma);

        expect(result).toEqual([]);
        expect(prisma.application.findMany).toHaveBeenCalled();
    });

    it('should return candidates with correct data structure', async () => {
        const mockPosition = { id: 1, title: 'Software Engineer' };
        const mockApplications = [
            {
                id: 1,
                candidate: {
                    firstName: 'John',
                    lastName: 'Doe',
                },
                interviewStep: {
                    name: 'Technical Interview',
                },
                interviews: [
                    { score: 85 },
                    { score: 90 },
                ],
            },
        ];

        (prisma.position.findUnique as jest.Mock).mockResolvedValue(mockPosition);
        (prisma.application.findMany as jest.Mock).mockResolvedValue(mockApplications);

        const result = await getCandidatesByPosition(1, prisma);

        expect(result).toHaveLength(1);
        expect(result![0]).toEqual({
            fullName: 'John Doe',
            currentInterviewStep: 'Technical Interview',
            averageScore: 87.5,
        });
    });

    it('should calculate average score correctly for multiple interviews', async () => {
        const mockPosition = { id: 1, title: 'Software Engineer' };
        const mockApplications = [
            {
                id: 1,
                candidate: { firstName: 'Jane', lastName: 'Smith' },
                interviewStep: { name: 'Final Interview' },
                interviews: [
                    { score: 70 },
                    { score: 80 },
                    { score: 90 },
                    { score: 100 },
                ],
            },
        ];

        (prisma.position.findUnique as jest.Mock).mockResolvedValue(mockPosition);
        (prisma.application.findMany as jest.Mock).mockResolvedValue(mockApplications);

        const result = await getCandidatesByPosition(1, prisma);

        expect(result![0].averageScore).toBe(85);
    });

    it('should return null for averageScore when candidate has no scored interviews', async () => {
        const mockPosition = { id: 1, title: 'Software Engineer' };
        const mockApplications = [
            {
                id: 1,
                candidate: { firstName: 'Bob', lastName: 'Johnson' },
                interviewStep: { name: 'Phone Screen' },
                interviews: [],
            },
        ];

        (prisma.position.findUnique as jest.Mock).mockResolvedValue(mockPosition);
        (prisma.application.findMany as jest.Mock).mockResolvedValue(mockApplications);

        const result = await getCandidatesByPosition(1, prisma);

        expect(result![0].averageScore).toBeNull();
    });

    it('should handle null scores correctly when calculating average', async () => {
        const mockPosition = { id: 1, title: 'Software Engineer' };
        const mockApplications = [
            {
                id: 1,
                candidate: { firstName: 'Alice', lastName: 'Williams' },
                interviewStep: { name: 'Technical Interview' },
                interviews: [
                    { score: 80 },
                    { score: null },
                    { score: 90 },
                    { score: null },
                ],
            },
        ];

        (prisma.position.findUnique as jest.Mock).mockResolvedValue(mockPosition);
        (prisma.application.findMany as jest.Mock).mockResolvedValue(mockApplications);

        const result = await getCandidatesByPosition(1, prisma);

        // Should only average the non-null scores: (80 + 90) / 2 = 85
        expect(result![0].averageScore).toBe(85);
    });

    it('should format full name correctly', async () => {
        const mockPosition = { id: 1, title: 'Software Engineer' };
        const mockApplications = [
            {
                id: 1,
                candidate: { firstName: 'Mary', lastName: 'Johnson' },
                interviewStep: { name: 'Initial Screen' },
                interviews: [{ score: 75 }],
            },
        ];

        (prisma.position.findUnique as jest.Mock).mockResolvedValue(mockPosition);
        (prisma.application.findMany as jest.Mock).mockResolvedValue(mockApplications);

        const result = await getCandidatesByPosition(1, prisma);

        expect(result![0].fullName).toBe('Mary Johnson');
    });

    it('should handle multiple candidates correctly', async () => {
        const mockPosition = { id: 1, title: 'Software Engineer' };
        const mockApplications = [
            {
                id: 1,
                candidate: { firstName: 'John', lastName: 'Doe' },
                interviewStep: { name: 'Technical Interview' },
                interviews: [{ score: 85 }],
            },
            {
                id: 2,
                candidate: { firstName: 'Jane', lastName: 'Smith' },
                interviewStep: { name: 'HR Interview' },
                interviews: [{ score: 90 }],
            },
            {
                id: 3,
                candidate: { firstName: 'Bob', lastName: 'Wilson' },
                interviewStep: { name: 'Final Interview' },
                interviews: [],
            },
        ];

        (prisma.position.findUnique as jest.Mock).mockResolvedValue(mockPosition);
        (prisma.application.findMany as jest.Mock).mockResolvedValue(mockApplications);

        const result = await getCandidatesByPosition(1, prisma);

        expect(result).toHaveLength(3);
        expect(result![0].fullName).toBe('John Doe');
        expect(result![1].fullName).toBe('Jane Smith');
        expect(result![2].fullName).toBe('Bob Wilson');
        expect(result![2].averageScore).toBeNull();
    });

    it('should handle database errors appropriately', async () => {
        (prisma.position.findUnique as jest.Mock).mockRejectedValue(new Error('Database connection error'));

        await expect(getCandidatesByPosition(1, prisma)).rejects.toThrow('Database connection error');
    });
});

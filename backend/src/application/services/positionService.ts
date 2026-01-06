import { PrismaClient } from '@prisma/client';

interface CandidateWithStats {
    fullName: string;
    currentInterviewStep: string | null;
    averageScore: number | null;
}

/**
 * Retrieves all candidates for a specific position with their current interview step and average score
 * @param positionId - The ID of the position to get candidates for
 * @param prisma - The Prisma client instance to use for database queries
 * @returns Array of candidates with their stats, or null if position doesn't exist
 */
export const getCandidatesByPosition = async (
    positionId: number,
    prisma: PrismaClient
): Promise<CandidateWithStats[] | null> => {
    try {
        // First verify the position exists
        const position = await prisma.position.findUnique({
            where: { id: positionId }
        });

        if (!position) {
            return null;
        }

        // Get all applications for this position with related data
        const applications = await prisma.application.findMany({
            where: {
                positionId: positionId
            },
            include: {
                candidate: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                interviewStep: {
                    select: {
                        name: true
                    }
                },
                interviews: {
                    select: {
                        score: true
                    }
                }
            }
        });

        // Map applications to the required format and calculate average scores
        const candidatesWithStats: CandidateWithStats[] = applications.map((application: any) => {
            // Calculate average score
            const scores = application.interviews
                .map((interview: any) => interview.score)
                .filter((score: any): score is number => score !== null);

            const averageScore = scores.length > 0
                ? scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length
                : null;

            return {
                fullName: `${application.candidate.firstName} ${application.candidate.lastName}`,
                currentInterviewStep: application.interviewStep?.name ?? null,
                averageScore: averageScore
            };
        });

        return candidatesWithStats;
    } catch (error) {
        console.error('Error retrieving candidates by position:', error);
        throw error;
    }
};

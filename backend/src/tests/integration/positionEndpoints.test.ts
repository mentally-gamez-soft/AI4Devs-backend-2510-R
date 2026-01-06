import request from 'supertest';
import { app } from '../../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Position Endpoints Integration Tests', () => {
    let testPositionId: number;
    let testCompanyId: number;
    let testInterviewFlowId: number;

    beforeAll(async () => {
        // Ensure the Prisma client is connected before running tests
        await prisma.$connect();

        const company = await prisma.company.create({
            data: {
                name: `TestCompany-${Date.now()}`, // Unique name to avoid conflicts
            }
        });
        testCompanyId = company.id;

        const interviewFlow = await prisma.interviewFlow.create({
            data: {
                description: 'Standard interview flow for testing',
            }
        });
        testInterviewFlowId = interviewFlow.id;

        const position = await prisma.position.create({
            data: {
                companyId: company.id,
                interviewFlowId: interviewFlow.id,
                title: 'Test Software Engineer',
                description: 'Test position for integration testing',
                location: 'Remote',
                jobDescription: 'Test job description',
            }
        });
        testPositionId = position.id;
    });

    afterAll(async () => {
        // Clean up test data in reverse order of creation (foreign keys)
        if (testPositionId) {
            await prisma.position.delete({
                where: { id: testPositionId }
            }).catch(() => {
                // Position might have related records, ignore delete errors
            });
        }

        if (testInterviewFlowId) {
            await prisma.interviewFlow.delete({
                where: { id: testInterviewFlowId }
            }).catch(() => {
                // InterviewFlow might have related records, ignore delete errors
            });
        }

        if (testCompanyId) {
            await prisma.company.delete({
                where: { id: testCompanyId }
            }).catch(() => {
                // Company might have related records, ignore delete errors
            });
        }

        // Cleanly disconnect the Prisma client after all tests are complete
        await prisma.$disconnect();
    });

    describe('GET /positions/:id/candidates', () => {
        it('should return 400 for invalid position ID format', async () => {
            const response = await request(app)
                .get('/positions/invalid/candidates')
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.message).toContain('valid number');
        });

        it('should return 404 when position does not exist', async () => {
            const response = await request(app)
                .get('/positions/99999/candidates')
                .expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.message).toContain('not found');
        });

        it('should return 200 and empty array for position with no candidates', async () => {
            const response = await request(app)
                .get(`/positions/${testPositionId}/candidates`)
                .expect(200)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty('candidates');
            expect(Array.isArray(response.body.candidates)).toBe(true);
            expect(response.body.candidates.length).toBe(0);
        });

        it('should return proper JSON content-type headers', async () => {
            const response = await request(app)
                .get(`/positions/${testPositionId}/candidates`)
                .expect(200);

            expect(response.headers['content-type']).toMatch(/json/);
        });

        it('should include position metadata in response', async () => {
            const response = await request(app)
                .get(`/positions/${testPositionId}/candidates`)
                .expect(200);

            expect(response.body).toHaveProperty('positionId');
            expect(response.body).toHaveProperty('candidatesCount');
            expect(response.body).toHaveProperty('candidates');
            expect(response.body.positionId).toBe(testPositionId);
            expect(response.body.candidatesCount).toBe(0);
        });

        it('should return candidates array as an array', async () => {
            const response = await request(app)
                .get(`/positions/${testPositionId}/candidates`)
                .expect(200);

            expect(Array.isArray(response.body.candidates)).toBe(true);
        });

        it('should handle candidates with correct data structure', async () => {
            // This test verifies the structure without requiring data
            const response = await request(app)
                .get(`/positions/${testPositionId}/candidates`)
                .expect(200);

            expect(response.body).toHaveProperty('candidates');
            expect(response.body).toHaveProperty('positionId');
            expect(response.body).toHaveProperty('candidatesCount');
            expect(typeof response.body.positionId).toBe('number');
            expect(typeof response.body.candidatesCount).toBe('number');
        });
    });
});

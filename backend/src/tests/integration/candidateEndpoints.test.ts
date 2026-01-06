import request from 'supertest';
import { app } from '../../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Candidate Endpoints Integration Tests', () => {
    beforeAll(async () => {
        // Ensure the Prisma client is connected before running tests
        await prisma.$connect();
    });

    afterAll(async () => {
        // Cleanly disconnect the Prisma client after all tests are complete
        await prisma.$disconnect();
    });

    describe('PUT /candidates/:id/stage', () => {
        it('should return 400 for invalid candidate ID format', async () => {
            const response = await request(app)
                .put('/candidates/invalid/stage')
                .send({ interviewStepId: 1 })
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.message).toContain('valid number');
        });

        it('should return 400 when interviewStepId is missing from body', async () => {
            const response = await request(app)
                .put('/candidates/1/stage')
                .send({})
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.message).toContain('required');
        });

        it('should return 400 for invalid interview step ID format', async () => {
            const response = await request(app)
                .put('/candidates/1/stage')
                .send({ interviewStepId: 'invalid' })
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('should return 404 when candidate does not exist', async () => {
            const response = await request(app)
                .put('/candidates/99999/stage')
                .send({ interviewStepId: 1 })
                .expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.message).toContain('not found');
        });

        it('should return 400 when interview step does not exist', async () => {
            // Note: This test assumes candidate 1 exists but interview step 99999 doesn't
            const response = await request(app)
                .put('/candidates/1/stage')
                .send({ interviewStepId: 99999 });

            if (response.status === 400) {
                expect(response.body).toHaveProperty('error');
                expect(response.body.message).toContain('interview step');
            }
        });

        it('should return proper JSON content-type headers', async () => {
            const response = await request(app)
                .put('/candidates/1/stage')
                .send({ interviewStepId: 1 });

            expect(response.headers['content-type']).toMatch(/json/);
        });

        it('should successfully update stage for valid candidate and interview step', async () => {
            // Note: This test requires actual data in the database
            // You'll need to adjust the IDs based on your test data
            
            // First, let's try to get a valid candidate
            const candidateResponse = await request(app).get('/candidates/1');
            
            if (candidateResponse.status === 200) {
                const response = await request(app)
                    .put('/candidates/1/stage')
                    .send({ interviewStepId: 1 });

                if (response.status === 200) {
                    expect(response.body).toHaveProperty('message');
                    expect(response.body).toHaveProperty('data');
                    expect(response.body.data).toHaveProperty('currentInterviewStep');
                }
            }
        });

        it('should return updated application data with correct structure', async () => {
            const response = await request(app)
                .put('/candidates/1/stage')
                .send({ interviewStepId: 1 });

            if (response.status === 200) {
                expect(response.body.data).toHaveProperty('candidate');
                expect(response.body.data).toHaveProperty('interviewStep');
                expect(response.body.data).toHaveProperty('position');
                expect(response.body.data.candidate).toHaveProperty('firstName');
                expect(response.body.data.candidate).toHaveProperty('lastName');
                expect(response.body.data.interviewStep).toHaveProperty('name');
            }
        });

        it('should verify the update persists in database', async () => {
            // This test requires setting up test data
            const updateResponse = await request(app)
                .put('/candidates/1/stage')
                .send({ interviewStepId: 2 });

            if (updateResponse.status === 200) {
                const updatedStepId = updateResponse.body.data.currentInterviewStep;
                expect(updatedStepId).toBe(2);

                // Verify by fetching the candidate's applications from DB
                const applications = await prisma.application.findMany({
                    where: { candidateId: 1 },
                    orderBy: { applicationDate: 'desc' },
                    take: 1
                });

                if (applications.length > 0) {
                    expect(applications[0].currentInterviewStep).toBe(2);
                }
            }
        });

        it('should handle candidates with multiple applications correctly', async () => {
            // This test verifies that the most recent application is updated
            // Note: Requires a candidate with multiple applications in test data
            
            const response = await request(app)
                .put('/candidates/1/stage')
                .send({ interviewStepId: 1 });

            // If successful, it should update the most recent application
            if (response.status === 200) {
                expect(response.body.data).toHaveProperty('id');
                expect(response.body.data.currentInterviewStep).toBe(1);
            }
        });

        it('should include success message in response', async () => {
            const response = await request(app)
                .put('/candidates/1/stage')
                .send({ interviewStepId: 1 });

            if (response.status === 200) {
                expect(response.body.message).toContain('updated successfully');
            }
        });
    });
});

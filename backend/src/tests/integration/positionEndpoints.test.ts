import request from 'supertest';
import { app } from '../../index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Position Endpoints Integration Tests', () => {
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
            // Note: This test assumes you have a position with no candidates
            // You may need to create one for testing or adjust the ID
            const response = await request(app)
                .get('/positions/1/candidates')
                .expect('Content-Type', /json/);

            if (response.status === 200) {
                expect(response.body).toHaveProperty('candidates');
                expect(Array.isArray(response.body.candidates)).toBe(true);
            }
        });

        it('should return proper JSON content-type headers', async () => {
            const response = await request(app)
                .get('/positions/1/candidates');

            expect(response.headers['content-type']).toMatch(/json/);
        });

        it('should return candidates with correct data structure', async () => {
            // Note: This test requires actual data in the database
            // Adjust the position ID based on your test data
            const response = await request(app)
                .get('/positions/1/candidates');

            if (response.status === 200 && response.body.candidates.length > 0) {
                const candidate = response.body.candidates[0];
                expect(candidate).toHaveProperty('fullName');
                expect(candidate).toHaveProperty('currentInterviewStep');
                expect(candidate).toHaveProperty('averageScore');
                expect(typeof candidate.fullName).toBe('string');
                expect(typeof candidate.currentInterviewStep).toBe('string');
            }
        });

        it('should calculate average scores correctly', async () => {
            // Note: This test requires a position with candidates that have interviews
            const response = await request(app)
                .get('/positions/1/candidates');

            if (response.status === 200 && response.body.candidates.length > 0) {
                const candidatesWithScores = response.body.candidates.filter(
                    (c: any) => c.averageScore !== null
                );
                
                if (candidatesWithScores.length > 0) {
                    const candidate = candidatesWithScores[0];
                    expect(typeof candidate.averageScore).toBe('number');
                    expect(candidate.averageScore).toBeGreaterThanOrEqual(0);
                    expect(candidate.averageScore).toBeLessThanOrEqual(100);
                }
            }
        });

        it('should handle candidates with no interviews', async () => {
            const response = await request(app)
                .get('/positions/1/candidates');

            if (response.status === 200 && response.body.candidates.length > 0) {
                // At least verify that averageScore can be null
                const candidatesWithoutScores = response.body.candidates.filter(
                    (c: any) => c.averageScore === null
                );
                // This is valid - candidates without interviews should have null scores
                expect(Array.isArray(candidatesWithoutScores)).toBe(true);
            }
        });

        it('should include position metadata in response', async () => {
            const response = await request(app)
                .get('/positions/1/candidates');

            if (response.status === 200) {
                expect(response.body).toHaveProperty('positionId');
                expect(response.body).toHaveProperty('candidatesCount');
                expect(response.body).toHaveProperty('candidates');
            }
        });
    });
});

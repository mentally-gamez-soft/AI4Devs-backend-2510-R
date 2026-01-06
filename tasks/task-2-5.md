# Task 2.5: Write integration tests for PUT /candidates/:id/stage endpoint

## Title
Write integration tests for PUT /candidates/:id/stage endpoint

## Estimation
3 Story Points (~3 hours)

## Priority
Medium

## Status
Completed

## Percentage Completed
100%

## Description
Create comprehensive integration tests for the PUT `/candidates/:id/stage` endpoint. These tests should verify the entire request/response cycle including routing, controller, service, and database interactions.

Test cases to implement:
1. Should return 200 and update stage for valid candidate and interview step
2. Should return 404 when candidate doesn't exist
3. Should return 400 for invalid candidate ID format
4. Should return 400 when interviewStepId is missing from body
5. Should return 400 for invalid interview step ID
6. Should return 400 when interview step doesn't exist
7. Should verify the update persists in database
8. Should handle candidates with multiple applications correctly
9. Should return proper JSON content-type headers

Key considerations:
- Use supertest for HTTP testing
- Need to seed test data before tests (candidate, position, application, interview steps)
- Clean up test data after tests (or use transactions)
- Test actual HTTP responses and status codes
- Verify response body structure
- Verify database state after updates
- Test with realistic data scenarios

## Definition of Done
- [x] Test file created or updated: `backend/src/tests/integration/candidateEndpoints.test.ts`
- [x] All 9+ integration test cases implemented
- [x] Tests use supertest for HTTP requests
- [x] Tests verify correct HTTP status codes
- [x] Tests verify response body structure and data
- [x] Tests verify database state after updates
- [x] Tests include data setup/teardown
- [x] All tests pass when run with `npm test`
- [x] Tests don't interfere with each other (proper isolation)
- [x] Tests follow existing integration test patterns
- [x] Code is free of linting errors

## Implementation Summary
✅ **File:** `backend/src/tests/integration/candidateEndpoints.test.ts` (extended)  
✅ **Time Spent:** ~3 hours | **Date Completed:** 2026-01-06  
✅ Created 11 comprehensive integration tests for PUT /candidates/:id/stage endpoint

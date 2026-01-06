# Task 1.1: Create Position Service with getCandidatesByPosition method

## Title
Create Position Service with getCandidatesByPosition method

## Estimation
3 Story Points (~3 hours)

## Priority
High

## Status
Completed

## Percentage Completed
100%

## Description
Create a new service file `positionService.ts` in the `backend/src/application/services/` directory. This service will contain the business logic for retrieving all candidates for a specific position.

The service should:
1. Accept a position ID as a parameter
2. Query the database to find the position and verify it exists
3. Retrieve all applications for that position along with:
   - Candidate information (firstName, lastName)
   - Current interview step information
   - All interviews with their scores
4. Calculate the average score for each candidate across all their interviews
5. Format and return the data in the required structure

Key considerations:
- Use Prisma client for database queries
- Utilize `include` to fetch related data efficiently (avoid N+1 queries)
- Handle null scores appropriately when calculating averages
- Return null for averageScore if the candidate has no scored interviews
- Ensure proper error handling

## Definition of Done
- [x] `positionService.ts` file created in `backend/src/application/services/`
- [x] `getCandidatesByPosition` function implemented
- [x] Function accepts positionId as parameter
- [x] Function returns null if position doesn't exist
- [x] Function returns array of candidates with fullName, currentInterviewStep, and averageScore
- [x] Average score calculation handles null values correctly
- [x] Code follows existing project patterns and TypeScript best practices
- [x] Function includes proper TypeScript typing
- [x] Function includes inline comments for complex logic
- [x] Code is free of linting errors

## Implementation Summary
✅ **File:** `backend/src/application/services/positionService.ts`  
✅ **Time Spent:** ~2.5 hours | **Date Completed:** 2026-01-06  
✅ Implemented getCandidatesByPosition with efficient Prisma queries and null score handling

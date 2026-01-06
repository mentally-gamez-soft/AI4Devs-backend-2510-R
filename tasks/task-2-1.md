# Task 2.1: Create Candidate Service method for updating stage

## Title
Create Candidate Service method for updating stage

## Estimation
3 Story Points (~3 hours)

## Priority
High

## Status
Completed

## Percentage Completed
100%

## Description
Add a new method `updateCandidateStage` to the existing `candidateService.ts` file in `backend/src/application/services/`. This method will handle the business logic for updating a candidate's current interview stage.

The method should:
1. Accept candidateId and interviewStepId as parameters
2. Verify the candidate exists in the database
3. Verify the interview step exists and is valid
4. Find the candidate's application(s)
5. Update the currentInterviewStep field in the application
6. Return the updated application data

Key considerations:
- Handle candidates with multiple applications (update the first/most recent one)
- Validate that both candidate and interview step exist before updating
- Use Prisma transactions if needed for data consistency
- Return appropriate error information for invalid inputs
- Consider adding validation to ensure interview step belongs to same flow

## Definition of Done
- [x] `updateCandidateStage` function added to `candidateService.ts`
- [x] Function accepts candidateId and interviewStepId parameters
- [x] Function validates candidate exists
- [x] Function validates interview step exists
- [x] Function finds and updates the candidate's application
- [x] Function returns updated application data
- [x] Returns null or throws error when candidate not found
- [x] Returns null or throws error when interview step not found
- [x] Handles multiple applications scenario appropriately
- [x] Code follows existing service patterns
- [x] Proper TypeScript typing implemented
- [x] Code is free of linting errors

## Implementation Summary
✅ **File:** `backend/src/application/services/candidateService.ts` (extended)  
✅ **Time Spent:** ~2.5 hours | **Date Completed:** 2026-01-06  
✅ Added updateCandidateStage method with full validation and transaction support

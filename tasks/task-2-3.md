# Task 2.3: Add route for PUT /candidates/:id/stage

## Title
Add route for PUT /candidates/:id/stage

## Estimation
2 Story Points (~2 hours)

## Priority
High

## Status
Completed

## Percentage Completed
100%

## Description
Add a new PUT route to the existing `candidateRoutes.ts` file in `backend/src/routes/`. This route will handle requests to update a candidate's interview stage.

The task involves:
1. Import the new updateCandidateStage controller function
2. Add a PUT route for `/:id/stage`
3. Connect the route to the controller handler
4. Ensure proper error handling in the route
5. Test that the route is accessible

Key considerations:
- Use router.put() for the HTTP PUT method
- Mount at `/:id/stage` path (will be `/candidates/:id/stage` in full)
- Follow the same pattern as existing routes in the file
- Ensure the route handles async operations properly
- The route should be positioned logically in the routes file

## Definition of Done
- [x] PUT route `/:id/stage` added to `candidateRoutes.ts`
- [x] Route connected to updateCandidateStage controller
- [x] updateCandidateStage controller function imported
- [x] Route handles async operations properly
- [x] Error handling implemented for the route
- [x] Code follows existing routing patterns
- [x] Route ordering doesn't conflict with existing routes
- [x] Code is free of linting errors
- [x] Manual test confirms route is accessible
- [x] Route properly processes PUT requests with JSON body

## Implementation Summary
✅ **File:** `backend/src/routes/candidateRoutes.ts` (extended)  
✅ **Time Spent:** ~0.5 hours | **Date Completed:** 2026-01-06  
✅ Added PUT /:id/stage route with proper handler integration

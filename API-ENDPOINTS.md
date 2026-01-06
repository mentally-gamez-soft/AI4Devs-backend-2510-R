# New API Endpoints Documentation

This document describes the two new API endpoints implemented for the ATS (Applicant Tracking System).

## Table of Contents
- [GET /positions/:id/candidates](#get-positionsidcandidates)
- [PUT /candidates/:id/stage](#put-candidatesidstage)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Examples](#examples)

---

## GET /positions/:id/candidates

Retrieves all candidates who have applied to a specific position, including their current interview step and average interview score.

### Endpoint
```
GET /positions/:id/candidates
```

### Parameters
- **id** (path parameter, required): The unique identifier of the position (integer)

### Response

#### Success Response (200 OK)
```json
{
  "positionId": 1,
  "candidatesCount": 3,
  "candidates": [
    {
      "fullName": "John Doe",
      "currentInterviewStep": "Technical Interview",
      "averageScore": 85.5
    },
    {
      "fullName": "Jane Smith",
      "currentInterviewStep": "HR Interview",
      "averageScore": 92.0
    },
    {
      "fullName": "Bob Johnson",
      "currentInterviewStep": "Phone Screen",
      "averageScore": null
    }
  ]
}
```

#### Response Fields
- **positionId**: The ID of the requested position
- **candidatesCount**: Total number of candidates for this position
- **candidates**: Array of candidate objects containing:
  - **fullName**: Concatenation of firstName and lastName
  - **currentInterviewStep**: Name of the current interview step the candidate is in
  - **averageScore**: Average score across all interviews (null if no scored interviews exist)

#### Error Responses

**400 Bad Request** - Invalid position ID format
```json
{
  "error": "Invalid ID format",
  "message": "Position ID must be a valid number"
}
```

**404 Not Found** - Position doesn't exist
```json
{
  "error": "Position not found",
  "message": "No position found with ID 999"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred while retrieving candidates"
}
```

### Use Cases
- View all applicants for a specific job opening
- Track candidate progress through interview stages
- Evaluate candidate performance based on average scores
- Generate reports on position applications

---

## PUT /candidates/:id/stage

Updates the current interview stage/step for a specific candidate.

### Endpoint
```
PUT /candidates/:id/stage
```

### Parameters
- **id** (path parameter, required): The unique identifier of the candidate (integer)

### Request Body
```json
{
  "interviewStepId": 2
}
```

#### Request Fields
- **interviewStepId** (required): The ID of the interview step to move the candidate to (integer)

### Response

#### Success Response (200 OK)
```json
{
  "message": "Candidate stage updated successfully",
  "data": {
    "id": 1,
    "candidateId": 1,
    "positionId": 1,
    "applicationDate": "2024-01-15T10:30:00.000Z",
    "currentInterviewStep": 2,
    "notes": null,
    "candidate": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    },
    "interviewStep": {
      "name": "Technical Interview",
      "orderIndex": 2
    },
    "position": {
      "title": "Senior Software Engineer"
    }
  }
}
```

#### Response Fields
- **message**: Confirmation message
- **data**: Updated application object containing:
  - **id**: Application ID
  - **candidateId**: Candidate's unique identifier
  - **currentInterviewStep**: Updated interview step ID
  - **candidate**: Candidate information (firstName, lastName, email)
  - **interviewStep**: Interview step details (name, orderIndex)
  - **position**: Position information (title)

#### Error Responses

**400 Bad Request** - Invalid candidate ID format
```json
{
  "error": "Invalid ID format",
  "message": "Candidate ID must be a valid number"
}
```

**400 Bad Request** - Missing interviewStepId
```json
{
  "error": "Missing required field",
  "message": "interviewStepId is required in request body"
}
```

**400 Bad Request** - Invalid interview step ID
```json
{
  "error": "Invalid interview step ID",
  "message": "interviewStepId must be a valid number"
}
```

**400 Bad Request** - Interview step doesn't exist
```json
{
  "error": "Invalid interview step",
  "message": "The specified interview step does not exist"
}
```

**400 Bad Request** - No application found
```json
{
  "error": "No application found",
  "message": "This candidate has no applications to update"
}
```

**404 Not Found** - Candidate doesn't exist
```json
{
  "error": "Candidate not found",
  "message": "No candidate found with ID 999"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred while updating candidate stage"
}
```

### Use Cases
- Move candidates through the interview pipeline
- Update candidate status after completing an interview
- Track progression through hiring workflow
- Manage multiple candidates across different stages

### Important Notes
- If a candidate has multiple applications (to different positions), the **most recent application** will be updated
- The interview step must exist in the database before it can be assigned
- All changes are immediately persisted to the database

---

## Authentication

Currently, these endpoints do not require authentication. In a production environment, you should implement proper authentication and authorization:

- Use JWT tokens or session-based authentication
- Verify user permissions before allowing stage updates
- Implement role-based access control (RBAC)
- Log all stage changes for audit purposes

---

## Error Handling

All endpoints follow consistent error handling patterns:

1. **Input Validation**: Returns 400 for invalid input formats
2. **Resource Not Found**: Returns 404 when resources don't exist
3. **Server Errors**: Returns 500 for unexpected errors
4. **Error Messages**: All errors include descriptive messages

### Error Response Format
```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

---

## Examples

### Example 1: Get All Candidates for a Position

**Request:**
```bash
curl -X GET http://localhost:3010/positions/1/candidates \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "positionId": 1,
  "candidatesCount": 2,
  "candidates": [
    {
      "fullName": "Alice Johnson",
      "currentInterviewStep": "Phone Screen",
      "averageScore": 88.0
    },
    {
      "fullName": "Bob Williams",
      "currentInterviewStep": "Technical Interview",
      "averageScore": 75.5
    }
  ]
}
```

### Example 2: Update Candidate Stage

**Request:**
```bash
curl -X PUT http://localhost:3010/candidates/1/stage \
  -H "Content-Type: application/json" \
  -d '{
    "interviewStepId": 3
  }'
```

**Response:**
```json
{
  "message": "Candidate stage updated successfully",
  "data": {
    "id": 1,
    "candidateId": 1,
    "currentInterviewStep": 3,
    "candidate": {
      "firstName": "Alice",
      "lastName": "Johnson",
      "email": "alice.johnson@example.com"
    },
    "interviewStep": {
      "name": "Final Interview",
      "orderIndex": 3
    },
    "position": {
      "title": "Senior Software Engineer"
    }
  }
}
```

### Example 3: Workflow - Track Candidate Through Pipeline

```bash
# Step 1: Get all candidates for a position
curl -X GET http://localhost:3010/positions/1/candidates

# Step 2: Update a candidate to next stage
curl -X PUT http://localhost:3010/candidates/1/stage \
  -H "Content-Type: application/json" \
  -d '{"interviewStepId": 2}'

# Step 3: Verify the update
curl -X GET http://localhost:3010/positions/1/candidates
```

---

## Testing

Test files are provided in the following locations:

- **Unit Tests**: `backend/src/tests/services/`
  - `positionService.test.ts`
  - `candidateService.test.ts`

- **Integration Tests**: `backend/src/tests/integration/`
  - `positionEndpoints.test.ts`
  - `candidateEndpoints.test.ts`

- **HTTP Tests**: `http-tests/ats-api-tests.http`

- **cURL Tests**: `test-queries.txt`

### Running Tests

```bash
# Run all tests
cd backend
npm test

# Run specific test file
npm test positionService.test.ts

# Run with coverage
npm test -- --coverage
```

---

## Database Schema

The endpoints interact with the following database tables:

- **Position**: Job openings
- **Candidate**: Applicant information
- **Application**: Links candidates to positions
- **InterviewStep**: Stages in the interview process
- **Interview**: Individual interview records with scores

### Key Relationships
- A Position has many Applications
- A Candidate has many Applications
- An Application belongs to one Position and one Candidate
- An Application has a current InterviewStep
- An Application has many Interviews

---

## Performance Considerations

- Both endpoints use Prisma's `include` feature to efficiently fetch related data
- Average score calculation is done in-memory after fetching data
- Consider adding pagination for positions with many candidates
- Consider caching frequently accessed position data
- Database indexes on foreign keys improve query performance

---

## Future Enhancements

1. **Pagination**: Add limit and offset parameters for large candidate lists
2. **Filtering**: Filter candidates by interview step or score range
3. **Sorting**: Sort candidates by name, score, or application date
4. **Bulk Updates**: Update multiple candidates' stages at once
5. **Application Selection**: Specify which application to update when candidate has multiple applications
6. **Validation**: Ensure interview step belongs to the position's interview flow
7. **Notifications**: Send notifications when candidate stages change
8. **Audit Logging**: Track all stage changes with timestamps and user information

---

## Support

For issues or questions about these endpoints:

1. Check the test files for usage examples
2. Review the API specification in `api-spec.yaml`
3. Consult the user stories in `user-stories/` directory
4. Review task breakdown in `tasks/` directory

---

## Version History

- **v1.0.0** (2026-01-06): Initial implementation of GET /positions/:id/candidates and PUT /candidates/:id/stage endpoints

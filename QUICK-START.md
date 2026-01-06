# Quick Start Guide - New ATS Endpoints

## Setup

1. **Start the backend server:**
```bash
cd backend
npm install
npm run build
npm start
```

2. **Ensure database is running:**
```bash
docker-compose up -d
```

3. **Run migrations (if needed):**
```bash
cd backend
npx prisma migrate dev
```

## Testing the Endpoints

### Using cURL

**Get all candidates for a position:**
```bash
curl http://localhost:3010/positions/1/candidates
```

**Update a candidate's stage:**
```bash
curl -X PUT http://localhost:3010/candidates/1/stage \
  -H "Content-Type: application/json" \
  -d '{"interviewStepId": 2}'
```

### Using HTTP Files

Open `http-tests/ats-api-tests.http` in VS Code with REST Client extension installed, then click "Send Request" above any test.

### Using Postman/Insomnia

Import the API specification from `backend/api-spec.yaml`

## Running Tests

```bash
cd backend

# Run all tests
npm test

# Run specific test file
npm test positionService.test.ts

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## Common Operations

### Get Position Candidates

**Endpoint:** `GET /positions/:id/candidates`

**Success Response:**
```json
{
  "positionId": 1,
  "candidatesCount": 3,
  "candidates": [
    {
      "fullName": "John Doe",
      "currentInterviewStep": "Technical Interview",
      "averageScore": 85.5
    }
  ]
}
```

### Update Candidate Stage

**Endpoint:** `PUT /candidates/:id/stage`

**Request Body:**
```json
{
  "interviewStepId": 2
}
```

**Success Response:**
```json
{
  "message": "Candidate stage updated successfully",
  "data": {
    "currentInterviewStep": 2,
    "candidate": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "interviewStep": {
      "name": "Technical Interview"
    }
  }
}
```

## Troubleshooting

### Error: Position not found (404)
- Verify the position ID exists in the database
- Check: `SELECT * FROM "Position";`

### Error: Candidate not found (404)
- Verify the candidate ID exists
- Check: `SELECT * FROM "Candidate";`

### Error: Interview step not found (400)
- Verify the interview step ID exists
- Check: `SELECT * FROM "InterviewStep";`

### Database Connection Issues
1. Ensure Docker is running: `docker ps`
2. Check database URL in `.env` file
3. Restart containers: `docker-compose restart`

### Build Errors
1. Clean build: `rm -rf dist/`
2. Reinstall: `npm install`
3. Generate Prisma client: `npx prisma generate`
4. Build: `npm run build`

## File Locations

- **Documentation:** `API-ENDPOINTS.md`
- **User Stories:** `user-stories/`
- **Tasks:** `tasks/`
- **Implementation:** `backend/src/`
- **Tests:** `backend/src/tests/`
- **HTTP Tests:** `http-tests/ats-api-tests.http`
- **cURL Examples:** `test-queries.txt`
- **API Spec:** `backend/api-spec.yaml`

## Development Workflow

1. Create a feature branch
2. Implement changes
3. Write tests
4. Run tests: `npm test`
5. Build: `npm run build`
6. Test manually with cURL or HTTP file
7. Commit changes
8. Push and create PR

## Need More Info?

- Full API documentation: [API-ENDPOINTS.md](API-ENDPOINTS.md)
- Implementation details: [IMPLEMENTATION-SUMMARY.md](IMPLEMENTATION-SUMMARY.md)
- User stories: [user-stories/](user-stories/)
- Task breakdown: [tasks/](tasks/)

## Quick Commands Reference

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run build        # Build TypeScript
npm start            # Start server
npm test             # Run tests
npm run dev          # Development mode (if configured)

# Database
docker-compose up -d              # Start database
docker-compose down               # Stop database
npx prisma migrate dev            # Run migrations
npx prisma generate               # Generate Prisma client
npx prisma studio                 # Open database GUI

# Testing
curl http://localhost:3010/positions/1/candidates
curl -X PUT http://localhost:3010/candidates/1/stage \
  -H "Content-Type: application/json" \
  -d '{"interviewStepId": 2}'
```

## Status Check

Verify everything is working:

```bash
# 1. Check if server is running
curl http://localhost:3010/

# 2. Test GET endpoint
curl http://localhost:3010/positions/1/candidates

# 3. Test PUT endpoint (if you have valid IDs)
curl -X PUT http://localhost:3010/candidates/1/stage \
  -H "Content-Type: application/json" \
  -d '{"interviewStepId": 1}'
```

Expected responses:
- First: "Hola LTI!"
- Second: JSON with candidates array
- Third: Success message with updated data

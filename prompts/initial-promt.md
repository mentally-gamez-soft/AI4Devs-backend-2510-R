You are a senior fullstack developer working on an ATS web application.

The application is described in the README.md file of this project.

Mainly, you will be working on the backend part of the application using Express.js and PostgreSQL through prisma ORM.

**TASKS**
1. Implement a new API endpoint GET /positions/:id/candidates that will return all candidates for a given job position, according to the positionID provided in the URL parameter. 
For each candidate, the endpoint should return the following information:

    Full name of the candidate (from the candidate table).

    current_interview_step: which phase of the process the candidate is in (from the application table).

    The average score of the candidate. Remember that each interview conducted by the candidate has a score (from the interview table).

2. Implement a new API endpoint PUT /candidates/:id/stage that will update the stage of the moved candidate. This endpoint allows modifying the current phase of the interview process for a specific candidate.

**REQUIREMENTS**
- You will create 2 user stories for the above features that you will cut into different tasks if needed.
- Each user story should contain the following sections:
  - Title
  - Description
  - Acceptance Criteria
  - Tasks
  - A mermaid diagram representing the flow of the user story.
- The user stories should be written in markdown format.
- The user stories will be stored in the directory `user-stories` and will be named `user-story-<number>.md` where <number> is the number of the user story.
- The tasks should be stored in the directory `tasks` and will be named `task-<us_number>-<number>.md` where <number> is the number of the task and <us_number> is the number of the user story.
- The tasks will contain the following sections:
  - Title
  - Estimation
  - Priority
  - status
  - percentage completed
  - Description
  - Definition of Done

**IMPLEMENTATION**
- After creating the user stories and tasks, proceed to implement the required API endpoints in the backend application using Express.js and Prisma ORM to interact with the PostgreSQL database.
- Make the migrations needed to the database schema if necessary.
- Write unit and integration tests for the new endpoints to ensure they work as expected in conjunction with the existing codebase and the database.
- Provide a set of test queries in curl that you'll store in the file `test-queries.txt` to demonstrate how to use the new endpoints.
- The tests suite will be stored in the `tests` directory. And a http test file will also be stored in the `http-tests` directory named `ats-api-tests.http`.
- Ensure that the code follows best practices for security, performance, and maintainability.
- Document the new endpoints in the API documentation, including request and response formats, and any necessary authentication or authorization requirements.
- Finally, update the user stories and tasks with the actual time taken to complete each task and any notes on challenges faced or decisions made during implementation.
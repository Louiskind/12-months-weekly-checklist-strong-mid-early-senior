# 12 Months road map to senior developer 

This APIs are created during learning process, a good start to practice
View interactive API documentation by running `npm run docs` and visiting `http://localhost:3000/docs`

## Prerequisites
- [Node.js](https://nodejs.org) (v16+)
- [PostgreSQL](https://www.postgresql.org)
- [npm](https://www.npmjs.com)

## Getting Started
1. **Clone the repo**
   ```bash
   git clone https://github.com/Louiskind/12-months-weekly-checklist-strong-mid-early-senior.git
   cd repo
2. Install dependencies
    bash
    npm install
3. Setup Environment Variables
    Copy .env.example to .env and update database credentials. 

4. Database Migrations
    To set up the database schema and apply migrations, run:
      bash
      npm run migrate

    Optional: To rollback the last migration, run npm run migrate:down. 
  
  TESTING ENDPOINTS
  Automated Tests
  To run the automated test suite (unit and integration tests, not available yet):
    bash
    npm test
    Manual Testing (API Endpoints)

  You also can test endpoints using cURL, Postman or directly on the browser using the swagger docs.
  Base URL: http://localhost:3000 
1. Create User
  Endpoint: POST /api/users
  Body: {"username": "test", "email": "test@example.com", "password": "12345678"}
  cURL:
  bash
  curl -X POST http://localhost:3000/users \
     -H "Content-Type: application/json" \
     -d '{"username": "test", "email": "test@example.com"}'
 
2. Get Users
Endpoint: GET /api/users
Description: Returns a list of users. 

---

### 3. Best Practices for Documenting
*   **Use Code Blocks:** Always use triple backticks (\`\`\`) for commands to make them copy-pasteable.
*   **Be Specific:** Instead of "run migrations," write the exact command (e.g., `npm run migrate` or `flask db upgrade`).
*   **Include Examples:** For endpoint testing, provide example request payloads and expected JSON responses.
*   **Environment Variables:** Clearly list which `.env` variables are required for migrations to work (e.g., `DATABASE_URL`).
*   **Use Visuals:** If possible, include a small GIF showing a successful `npm test` run.

### 4. Alternative: API Documentation
If you have many endpoints, consider using OpenAPI/Swagger. You can document this in your README by stating:
> "View interactive API documentation by running `npm run docs` and visiting `http://localhost:3000/api-docs`".

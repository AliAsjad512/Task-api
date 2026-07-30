# task-api

A small task management REST API, built for practicing CI/CD pipelines with GitHub Actions.

## Stack
- Node.js + Express
- PostgreSQL (via `pg`)
- Jest + Supertest for tests

## Endpoints
- `GET /health` — health check
- `POST /tasks` — create a task (`{ "title": "..." }`)
- `GET /tasks` — list all tasks
- `GET /tasks/:id` — get one task
- `PUT /tasks/:id` — update a task (`{ "title": "...", "done": true }`)
- `DELETE /tasks/:id` — delete a task

## Local setup

1. Start Postgres (locally or via Docker):
   ```bash
   docker run -d --name task-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=task_api -p 5432:5432 postgres:16
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Run the app:
   ```bash
   npm run dev
   ```

## Environment variables
| Variable      | Default     |
|---------------|-------------|
| `PGHOST`      | `localhost` |
| `PGPORT`      | `5432`      |
| `PGUSER`      | `postgres`  |
| `PGPASSWORD`  | `postgres`  |
| `PGDATABASE`  | `task_api`  |
| `PORT`        | `5000`      |

## CI/CD

No pipeline yet — this is intentional. Build it yourself in `.github/workflows/`.

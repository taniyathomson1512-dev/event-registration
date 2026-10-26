# Gatherwell — Event Registration Admin

A responsive MERN event-management dashboard with event creation, editing, deletion, search, registration totals, and MongoDB Atlas persistence.

## Project layout

- `frontend/` — React, Vite, React Router, Axios, Lucide icons
- `backend/` — Express REST API, Mongoose model, validation, MongoDB connection

## Before running

1. Install Node.js 18 or newer.
2. In MongoDB Atlas, create a cluster and database user, allow your development IP address in Network Access, and copy the Node.js connection string.
3. Open `backend/.env` and replace `your_mongodb_atlas_connection_string_here` with the Atlas connection string. Replace the database username and password placeholders in the URI with your own values. Keep the URI private.
4. Keep `frontend/.env` set to `VITE_API_URL=http://localhost:5000/api` for local development.

The included backend `.env` is a template because real Atlas credentials cannot be embedded in a project zip. The backend will not connect until you add your own valid connection string.

## Run in VS Code

Open the extracted `event-registration-admin` folder in VS Code. Use two terminals.

Terminal 1:

```bash
cd backend
npm install
npm run dev
```

Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the frontend terminal, usually `http://localhost:5173`.

## REST API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/events` | List events |
| GET | `/api/events/:id` | Get one event |
| POST | `/api/events` | Create an event |
| PUT | `/api/events/:id` | Update an event |
| DELETE | `/api/events/:id` | Delete an event |
| GET | `/api/health` | Check API status |

The event dashboard displays a shortened event ID derived from MongoDB's document ID. Registration totals can be maintained in the event form; the default for a new event is zero. This starter project does not include a separate public registration workflow.

## GitHub setup

Commit both `frontend/` and `backend/`. Do not commit real Atlas credentials. Before publishing, replace the template URI in `backend/.env` locally and keep any real credential out of public source control. For an evaluator's fresh clone, provide the required Atlas URI through the backend environment.

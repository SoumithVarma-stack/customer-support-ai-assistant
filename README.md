# Customer Support AI Assistant

This is a proof of concept customer support app.

A support agent can enter a customer message, generate an AI draft, review and edit the draft, then approve or reject it. The app also saves approve/reject decisions in a local audit log.

The AI response is only a suggestion. It is not sent automatically.

## What It Uses

- Backend: Node.js, Express
- Frontend: React, TypeScript, Vite
- LLM: Google Gemini API
- Storage: Local JSON files

## Main Features

- Enter a customer query
- Search local support data
- Generate a Gemini draft response
- Use mock fallback when Gemini is not available
- Edit the draft before approval
- Approve or reject the draft
- Save feedback and audit logs
- View recent audit history

## Setup

You need Node.js and npm installed.

## Backend Setup

```bash
cd backend
npm install
```

Create a backend `.env` file:

```bash
cp .env.example .env
```

Example backend `.env`:

```env
PORT=5001
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5001
```

## Frontend Setup

```bash
cd frontend
npm install
```

Create a frontend `.env` file:

```bash
cp .env.example .env
```

Example frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:5001
```

Start the frontend:

```bash
npm run dev
```

Open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

## Run The Full App

Use two terminals.

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

## Test The Workflow

1. Open the frontend.
2. Enter a customer message.
3. Click `Generate Draft`.
4. Review the retrieved context and AI draft.
5. Edit the draft if needed.
6. Add feedback.
7. Click `Approve` or `Reject`.
8. Check audit history.

Audit records are saved in:

```text
backend/data/audit_logs.json
```

## Notes

- The dataset is synthetic and stored in local JSON files.
- The Gemini API key is only used in the backend.
- If Gemini is missing or fails, the backend uses a mock fallback draft.
- This is not a production app. It is a proof of concept for the assignment.

## More Documentation

Detailed notes are in the `docs/` folder:

- `docs/architecture.md`
- `docs/prompt-design.md`
- `docs/responsible-ai.md`
- `docs/limitations.md`
- `docs/assumptions.md`
- `docs/future-improvements.md`

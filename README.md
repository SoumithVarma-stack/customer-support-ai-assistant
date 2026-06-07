# Customer Support AI Assistant

A proof of concept app for a customer support agent. The agent enters a customer message, the backend searches local support data, Gemini creates a draft reply, and the agent reviews the draft before approving or rejecting it.

The AI draft is not sent automatically. A human agent must review it first.

## Features

- Agent can enter a customer query.
- Backend searches local FAQs, policies, and sample tickets.
- Backend sends the query and retrieved context to Gemini.
- If Gemini is not available, the backend uses a mock fallback draft.
- Agent can edit the draft before approval.
- Agent can approve or reject the draft.
- Feedback can be added during approval or rejection.
- Approved and rejected records are saved in a local audit log file.
- Frontend shows retrieved context, confidence, draft status, and audit history.

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, CommonJS
- LLM: Google Gemini API through `@google/genai`
- Storage: Local JSON files
- Styling: Plain CSS

## Folder Structure

```text
customer-support-ai-assistant/
  README.md
  assignment/
    requirements.md
    Assignment_3_Fullstack.pdf
  backend/
    package.json
    .env.example
    src/
      server.js
      routes/
      services/
      utils/
    data/
      faqs.json
      policies.json
      sample_tickets.json
      audit_logs.json
  frontend/
    package.json
    .env.example
    index.html
    src/
      App.tsx
      api.ts
      components/
      styles.css
  docs/
    architecture.md
    prompt-design.md
    responsible-ai.md
    limitations.md
    assumptions.md
    future-improvements.md
```

## Prerequisites

- Node.js
- npm
- A Gemini API key if you want real LLM drafts

The app can still run without a Gemini key. In that case the backend uses the mock fallback draft.

## Backend Setup

```bash
cd backend
npm install
```

Create a backend `.env` file:

```bash
cp .env.example .env
```

Example:

```env
PORT=5001
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend:

```bash
npm run dev
```

The backend runs at:

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

Example:

```env
VITE_API_BASE_URL=http://localhost:5001
```

Start the frontend:

```bash
npm run dev
```

Vite usually runs at:

```text
http://localhost:5173
```

## Gemini API Key Setup

The Gemini API key is used only by the backend.

Add it to `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Do not put this key in the frontend. The frontend only calls the backend API.

If `GEMINI_API_KEY` is missing or Gemini fails, the backend returns a mock draft.

## How To Run The App

Open two terminals.

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

Then open the frontend URL shown by Vite.

## How To Test The Full Workflow

1. Enter a customer message, for example:
   ```text
   my order is delayed from logistics partner
   ```
2. Click `Generate Draft`.
3. Review the retrieved context.
4. Edit the draft if needed.
5. Add feedback.
6. Click `Approve` or `Reject`.
7. Check the audit history panel.
8. Open `backend/data/audit_logs.json` to see the saved record.

## Backend API Endpoints

### GET `/api/health`

Checks if the backend is running.

### POST `/api/draft`

Request:

```json
{
  "customerQuery": "my order is delayed from logistics partner"
}
```

Response:

```json
{
  "customerQuery": "...",
  "retrievedContext": [
    {
      "sourceType": "faq",
      "title": "Tracking an order",
      "summary": "Customers can track an order from the order history page or shipping email.",
      "matchedKeywords": ["order"],
      "score": 1
    }
  ],
  "draft": "...",
  "confidence": "medium",
  "status": "draft_generated"
}
```

### POST `/api/approve`

Saves an approved draft.

Request:

```json
{
  "customerQuery": "...",
  "originalDraft": "...",
  "finalResponse": "...",
  "feedback": "optional feedback"
}
```

### POST `/api/reject`

Saves a rejected draft.

Request:

```json
{
  "customerQuery": "...",
  "originalDraft": "...",
  "feedback": "reason for rejection"
}
```

### GET `/api/audit-logs`

Returns all audit records from `backend/data/audit_logs.json`.

## Dataset Description

The local dataset is synthetic and small. It is only for the proof of concept.

- `backend/data/faqs.json`: 5 FAQ records
- `backend/data/policies.json`: 5 policy records
- `backend/data/sample_tickets.json`: 5 sample support tickets
- `backend/data/audit_logs.json`: saved approve/reject records

The search uses keyword matching. It returns source type, title, summary, matched keywords, and score.

## Audit Log Behavior

Approved records save:

- customer query
- original AI draft
- final edited response
- feedback
- status `approved`
- timestamp

Rejected records save:

- customer query
- original AI draft
- feedback
- status `rejected`
- timestamp

The audit log is stored locally in:

```text
backend/data/audit_logs.json
```

## Responsible AI Summary

- The AI only creates a draft.
- The agent can edit the draft.
- The draft is never auto-sent.
- The agent approves or rejects the draft.
- Feedback is saved.
- Audit records are saved locally.
- Retrieved context is shown to help the agent understand why a draft was created.

## Limitations

- This is a proof of concept.
- It is scoped to simple e-commerce support examples.
- The dataset is small and synthetic.
- Search uses keyword matching, not semantic search.
- Local JSON storage is not suitable for production or multi-user use.
- There is no authentication.
- The LLM may still make mistakes, so human review is required.

## Future Improvements

- Add semantic search with embeddings.
- Use a vector database.
- Add a larger approved support knowledge base.
- Add user login and role-based access.
- Store audit logs in a database.
- Add conversation threading.
- Add feedback analytics.
- Add monitoring and quality metrics.

More details are in the `docs/` folder.

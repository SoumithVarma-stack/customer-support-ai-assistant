# Architecture

This app has a React frontend and an Express backend. The backend owns the data, Gemini API key, search logic, draft generation, and audit logging.

## Text Diagram

```text
Support Agent
   |
   v
React + TypeScript Frontend
   |
   | REST API calls
   v
Node.js + Express Backend
   |
   | reads local JSON data
   v
FAQs + Policies + Sample Tickets
   |
   | matched context
   v
Gemini Draft Service
   |
   | draft response
   v
Frontend Review Screen
   |
   | approve or reject
   v
Local Audit Log JSON File
```

## Frontend Flow

1. The agent enters a customer message.
2. The frontend sends the message to `POST /api/draft`.
3. The frontend shows retrieved context, confidence, and the draft.
4. The agent edits the draft and adds feedback if needed.
5. The agent approves or rejects the draft and it is stored in audit logs.

## Backend Flow

1. Express receives the API request.
2. The route validates required fields.
3. Services handle search, draft generation, or audit logging.
4. Data is read from or written to local JSON files.
5. The backend returns JSON responses to the frontend.

## Dataset Retrieval Flow

1. `dataService.js` reads:
   - `faqs.json`
   - `policies.json`
   - `sample_tickets.json`
2. The records are combined into one list.
3. Each record gets a `sourceType`.
4. `keywordSearch.js` compares the customer query with record text.
5. Top matching records are returned as retrieved context.

## LLM Draft Generation Flow

1. The backend receives the customer query.
2. It searches local support data.
3. It calculates confidence from the number of matches.
4. It builds a Gemini prompt with the query and retrieved context.
5. Gemini returns a customer-facing draft.
6. If Gemini is missing or fails, the mock fallback creates a simple draft.

## Human Approval And Audit Flow

1. The agent reviews the draft.
2. The agent edits the response if needed.
3. The agent approves or rejects the draft.
4. The backend saves the decision in `audit_logs.json`.
5. The audit record includes status, timestamp, query, draft, and feedback.

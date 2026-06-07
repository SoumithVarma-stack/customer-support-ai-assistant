# Responsible AI Notes

This project treats AI as a helper, not as an automatic sender.

## Human-In-The-Loop Approval

The AI response is only a draft. A support agent must review it before using it.

The app has approve and reject actions. This keeps a human in control.

## Agent Edit Control

The draft appears in an editable text area. The agent can change the wording before approving it.

This is important because the AI may be incomplete or wrong.

## Reject Flow

The agent can reject a draft. Rejection requires feedback.

This helps record why the draft was not useful.

## Feedback Capture

Feedback is saved with the audit record.

This can help improve prompts, data quality, and future model behavior.

## Audit Trail

Approved and rejected decisions are saved in `backend/data/audit_logs.json`.

Each audit record includes:

- customer query
- draft
- final response when approved
- feedback
- status
- timestamp

## Explainability Through Context

The frontend shows retrieved context from local data.

It also shows matched keywords and scores. This helps the agent understand what support data influenced the draft.

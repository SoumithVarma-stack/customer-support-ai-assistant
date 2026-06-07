# Limitations

This project is a proof of concept. It is not a production support system.

## Main Limitations

- It is scoped to simple e-commerce support examples.
- The dataset is synthetic and lightweight.
- Retrieval uses keyword matching, not semantic search.
- It may miss queries that use synonyms or vague wording.
- It may return weak matches if the query uses common words.
- Local JSON storage is not suitable for multi-user production usage.
- There is no login or role-based access.
- There is no real conversation threading.
- There is no monitoring or evaluation dashboard.

## Dataset Limitations

The current data files contain only a few examples:

- 5 FAQs
- 5 policies
- 5 sample tickets

This is enough for a demo, but not enough for real support coverage.

## Search Limitations

The search checks matching words. It does not understand meaning.

For production, the app should use an approved knowledge base with embeddings and a vector database.

## Storage Limitations

Audit records are stored in `audit_logs.json`.

This is simple for local testing, but it is not safe for production. A real app should use a database with backups and access control.

## LLM Limitations

Gemini can still produce incorrect or unsupported text.

The agent must review every draft before sending it to a customer.

# Prompt Design

The prompt is built in `backend/src/services/llmService.js`.

The goal is simple: ask Gemini to write a draft response that a support agent can review and send.

## Inputs Used In The Prompt

The prompt includes:

- the customer query
- retrieved support context
- retrieval confidence
- whether context was found

The retrieved context includes source type, title, summary, matched keywords, and score. This is for Gemini to use silently.

## Tone Rules

The prompt asks Gemini to:

- answer the customer directly
- use a polite tone
- sound professional
- be empathetic
- keep the response short and clear
- write only the customer-facing message

## Safety Rules

The prompt tells Gemini:

- do not explain its reasoning
- do not list retrieved documents
- do not mention internal context
- do not mention FAQs, policies, tickets, scores, or matched keywords
- do not say "Based on our support information"

## No Hallucination Rule

The prompt tells Gemini not to invent details.

It must not promise:

- refunds
- credits
- replacements
- cancellations
- delivery dates

unless the retrieved context clearly supports it.

## Weak Context Behavior

If context is weak or missing, Gemini can still write a natural response. But it should avoid policy-specific claims.

For example, it can say the support team can review the details. It should not make a promise that is not supported by the data.

## Fallback Behavior

If `GEMINI_API_KEY` is missing or the Gemini request fails, the backend uses `generateMockDraft()` in `draftService.js`.

The mock fallback:

- returns a simple greeting for greeting messages
- returns a cautious support reply when no context is found
- returns a more specific order/shipping reply when matching context exists

The fallback keeps the app usable during local testing.

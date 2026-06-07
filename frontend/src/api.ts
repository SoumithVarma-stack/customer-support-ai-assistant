const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const FALLBACK_API_BASE_URL = API_BASE_URL.includes('localhost')
  ? API_BASE_URL.replace('localhost', '127.0.0.1')
  : '';

export type RetrievedContext = {
  id: string;
  sourceType: 'faq' | 'policy' | 'sample_ticket' | string;
  title: string;
  summary: string;
  matchedKeywords?: string[];
  score?: number;
};

export type DraftResponse = {
  customerQuery: string;
  retrievedContext: RetrievedContext[];
  draft: string;
  confidence: 'high' | 'medium' | 'low';
  status: string;
};

export type AuditLog = {
  id: string;
  customerQuery: string;
  originalDraft: string;
  finalResponse?: string;
  feedback?: string;
  status: 'approved' | 'rejected';
  timestamp: string;
};

type ApprovePayload = {
  customerQuery: string;
  originalDraft: string;
  finalResponse: string;
  feedback: string;
};

type RejectPayload = {
  customerQuery: string;
  originalDraft: string;
  feedback: string;
};

async function fetchFromApi(baseUrl: string, path: string, options?: RequestInit) {
  return fetch(`${baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response;

  try {
    response = await fetchFromApi(API_BASE_URL, path, options);
  } catch {
    if (!FALLBACK_API_BASE_URL) {
      throw new Error(`Cannot reach backend at ${API_BASE_URL}. Please check that the backend server is running.`);
    }

    try {
      response = await fetchFromApi(FALLBACK_API_BASE_URL, path, options);
    } catch {
      throw new Error(
        `Cannot reach backend at ${API_BASE_URL} or ${FALLBACK_API_BASE_URL}. Please check that the backend server is running.`,
      );
    }
  }

  let data: unknown = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data
        ? String((data as { error: unknown }).error)
        : 'Something went wrong. Please try again.';

    throw new Error(message);
  }

  return data as T;
}

export function generateDraft(customerQuery: string) {
  return request<DraftResponse>('/api/draft', {
    method: 'POST',
    body: JSON.stringify({ customerQuery }),
  });
}

export function approveDraft(payload: ApprovePayload) {
  return request<AuditLog>('/api/approve', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function rejectDraft(payload: RejectPayload) {
  return request<AuditLog>('/api/reject', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getAuditLogs() {
  return request<AuditLog[]>('/api/audit-logs');
}

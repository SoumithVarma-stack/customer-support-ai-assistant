import { useEffect, useState } from 'react';
import { approveDraft, AuditLog, DraftResponse, generateDraft, getAuditLogs, rejectDraft } from './api';
import AuditLogPanel from './components/AuditLogPanel';
import ContextPanel from './components/ContextPanel';
import DraftReviewPanel from './components/DraftReviewPanel';
import Header from './components/Header';
import QueryPanel from './components/QueryPanel';

type Notice = {
  type: 'success' | 'error';
  message: string;
};

function App() {
  const [customerQuery, setCustomerQuery] = useState('');
  const [draftResponse, setDraftResponse] = useState<DraftResponse | null>(null);
  const [editedDraft, setEditedDraft] = useState('');
  const [feedback, setFeedback] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSavingDecision, setIsSavingDecision] = useState(false);
  const [isLoadingAuditLogs, setIsLoadingAuditLogs] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [auditError, setAuditError] = useState('');

  async function loadAuditLogs(options = { showError: true }) {
    setIsLoadingAuditLogs(true);

    if (options.showError) {
      setAuditError('');
    }

    try {
      const logs = await getAuditLogs();
      setAuditLogs([...logs].reverse());
      setAuditError('');
    } catch (error) {
      if (options.showError) {
        setAuditError(error instanceof Error ? error.message : 'Could not load audit logs.');
      }
    } finally {
      setIsLoadingAuditLogs(false);
    }
  }

  useEffect(() => {
    loadAuditLogs();
  }, []);

  function clearActiveWorkflow() {
    setCustomerQuery('');
    setDraftResponse(null);
    setEditedDraft('');
    setFeedback('');
  }

  function addAuditRecordToHistory(auditRecord: AuditLog) {
    setAuditError('');
    setAuditLogs((currentLogs) => [
      auditRecord,
      ...currentLogs.filter((log) => log.id !== auditRecord.id),
    ]);
  }

  function handleCustomerQueryChange(value: string) {
    if (notice?.type === 'error') {
      setNotice(null);
    }

    setCustomerQuery(value);
  }

  async function handleGenerateDraft(customerQuery: string) {
    setIsGenerating(true);
    setNotice(null);
    setDraftResponse(null);
    setEditedDraft('');
    setFeedback('');

    try {
      const response = await generateDraft(customerQuery);
      setDraftResponse(response);
      setEditedDraft(response.draft);
      setFeedback('');
      setNotice({ type: 'success', message: 'Draft generated. Please review it before approval.' });
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Could not generate draft.',
      });
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleApprove() {
    if (!draftResponse) {
      return;
    }

    if (!editedDraft.trim()) {
      setNotice({ type: 'error', message: 'Final response cannot be empty.' });
      return;
    }

    setIsSavingDecision(true);
    setNotice(null);

    try {
      const savedAuditRecord = await approveDraft({
        customerQuery: draftResponse.customerQuery,
        originalDraft: draftResponse.draft,
        finalResponse: editedDraft,
        feedback,
      });
      addAuditRecordToHistory(savedAuditRecord);
      clearActiveWorkflow();
      setNotice({ type: 'success', message: 'Draft approved and saved to the audit log.' });
      loadAuditLogs({ showError: false });
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Could not approve draft.',
      });
    } finally {
      setIsSavingDecision(false);
    }
  }

  async function handleReject() {
    if (!draftResponse) {
      return;
    }

    if (!feedback.trim()) {
      setNotice({ type: 'error', message: 'Please add feedback before rejecting the draft.' });
      return;
    }

    setIsSavingDecision(true);
    setNotice(null);

    try {
      const savedAuditRecord = await rejectDraft({
        customerQuery: draftResponse.customerQuery,
        originalDraft: draftResponse.draft,
        feedback,
      });
      addAuditRecordToHistory(savedAuditRecord);
      clearActiveWorkflow();
      setNotice({ type: 'success', message: 'Draft rejected and saved to the audit log.' });
      loadAuditLogs({ showError: false });
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Could not reject draft.',
      });
    } finally {
      setIsSavingDecision(false);
    }
  }

  return (
    <div className="app-shell">
      <Header />

      <main className="dashboard-grid">
        <section className="main-column">
          <QueryPanel
            customerQuery={customerQuery}
            isLoading={isGenerating}
            onCustomerQueryChange={handleCustomerQueryChange}
            onGenerateDraft={handleGenerateDraft}
          />

          {notice?.type === 'success' && (
            <div className={`notice notice-${notice.type}`} role="status">
              {notice.message}
            </div>
          )}

          <ContextPanel
            context={draftResponse?.retrievedContext ?? []}
            confidence={draftResponse?.confidence}
            hasDraft={Boolean(draftResponse)}
          />

          <DraftReviewPanel
            draftResponse={draftResponse}
            editedDraft={editedDraft}
            feedback={feedback}
            isSaving={isSavingDecision}
            onDraftChange={setEditedDraft}
            onFeedbackChange={setFeedback}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </section>

        <aside className="side-column">
          <AuditLogPanel
            auditLogs={auditLogs}
            isLoading={isLoadingAuditLogs}
            error={auditError}
            onRefresh={loadAuditLogs}
          />
        </aside>
      </main>
    </div>
  );
}

export default App;

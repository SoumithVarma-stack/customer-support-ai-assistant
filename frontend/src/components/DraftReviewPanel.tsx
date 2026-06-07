import { DraftResponse } from '../api';

type DraftReviewPanelProps = {
  draftResponse: DraftResponse | null;
  editedDraft: string;
  feedback: string;
  isSaving: boolean;
  onDraftChange: (value: string) => void;
  onFeedbackChange: (value: string) => void;
  onApprove: () => void;
  onReject: () => void;
};

function DraftReviewPanel({
  draftResponse,
  editedDraft,
  feedback,
  isSaving,
  onDraftChange,
  onFeedbackChange,
  onApprove,
  onReject,
}: DraftReviewPanelProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>AI draft review</h2>
          <p>Edit the suggested response before making a decision.</p>
        </div>
        {draftResponse && <span className="status-badge">{draftResponse.status.replace(/_/g, ' ')}</span>}
      </div>

      {!draftResponse && <p className="empty-state">No draft yet. Generate one from a customer query.</p>}

      {draftResponse && (
        <div className="review-stack">
          <label htmlFor="draft-response">Editable draft</label>
          <textarea
            id="draft-response"
            value={editedDraft}
            onChange={(event) => onDraftChange(event.target.value)}
            rows={10}
          />

          <label htmlFor="feedback">Feedback</label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(event) => onFeedbackChange(event.target.value)}
            placeholder="Add approval notes or a reason for rejection."
            rows={4}
          />

          <div className="action-row">
            <button className="approve-button" type="button" onClick={onApprove} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Approve'}
            </button>
            <button className="reject-button" type="button" onClick={onReject} disabled={isSaving}>
              Reject
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default DraftReviewPanel;

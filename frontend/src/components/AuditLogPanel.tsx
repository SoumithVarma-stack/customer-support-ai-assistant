import { AuditLog } from '../api';

type AuditLogPanelProps = {
  auditLogs: AuditLog[];
  isLoading: boolean;
  error: string;
  onRefresh: () => void;
};

function formatDate(timestamp: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp));
}

function AuditLogPanel({ auditLogs, isLoading, error, onRefresh }: AuditLogPanelProps) {
  return (
    <section className="panel audit-panel">
      <div className="panel-heading">
        <div>
          <h2>Audit history</h2>
          <p>Recent human decisions.</p>
        </div>
        <button className="secondary-button" type="button" onClick={onRefresh} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && <div className="notice notice-error">{error}</div>}

      {!error && !isLoading && !auditLogs.length && <p className="empty-state">No audit records yet.</p>}

      <div className="audit-list">
        {auditLogs.map((log) => (
          <article className="audit-card" key={log.id}>
            <div className="audit-card-top">
              <span className={`decision-badge decision-${log.status}`}>{log.status}</span>
              <time>{formatDate(log.timestamp)}</time>
            </div>

            <h3>{log.customerQuery}</h3>

            {log.status === 'approved' && log.finalResponse && (
              <p className="audit-response">{log.finalResponse}</p>
            )}

            {log.feedback && (
              <p className="audit-feedback">
                <strong>Feedback:</strong> {log.feedback}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default AuditLogPanel;

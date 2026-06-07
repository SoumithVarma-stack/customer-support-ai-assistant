import { RetrievedContext } from '../api';

type ContextPanelProps = {
  context: RetrievedContext[];
  confidence?: 'high' | 'medium' | 'low';
  hasDraft: boolean;
};

function formatSourceType(sourceType: string) {
  return sourceType.replace(/_/g, ' ');
}

function ContextPanel({ context, confidence, hasDraft }: ContextPanelProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Retrieved context</h2>
          <p>Local support records used for the draft.</p>
        </div>
        {confidence && <span className={`status-badge confidence-${confidence}`}>{confidence}</span>}
      </div>

      {!hasDraft && <p className="empty-state">Generate a draft to see matching support context.</p>}

      {hasDraft && !context.length && (
        <div className="warning-box">
          No useful context was found. Treat this as low confidence and review the response manually.
        </div>
      )}

      {context.length > 0 && (
        <div className="context-list">
          {context.map((item) => (
            <article className="context-card" key={item.id}>
              <div className="context-card-top">
                <span className="source-pill">{formatSourceType(item.sourceType)}</span>
                {typeof item.score === 'number' && <span className="score-pill">score {item.score}</span>}
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              {Boolean(item.matchedKeywords?.length) && (
                <div className="keyword-row">
                  {item.matchedKeywords?.map((keyword) => (
                    <span key={keyword}>{keyword}</span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ContextPanel;

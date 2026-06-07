import { FormEvent, useState } from 'react';

type QueryPanelProps = {
  customerQuery: string;
  isLoading: boolean;
  onCustomerQueryChange: (value: string) => void;
  onGenerateDraft: (customerQuery: string) => void;
};

function QueryPanel({
  customerQuery,
  isLoading,
  onCustomerQueryChange,
  onGenerateDraft,
}: QueryPanelProps) {
  const [validationError, setValidationError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!customerQuery.trim()) {
      setValidationError('Enter a customer question before generating a draft.');
      return;
    }

    setValidationError('');
    onGenerateDraft(customerQuery.trim());
  }

  function handleQueryChange(value: string) {
    if (validationError) {
      setValidationError('');
    }

    onCustomerQueryChange(value);
  }

  return (
    <section className="panel query-panel">
      <div className="panel-heading">
        <div>
          <h2>Customer query</h2>
          <p>Paste the customer message and generate a draft for review.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="customer-query">Customer message</label>
        <textarea
          id="customer-query"
          value={customerQuery}
          onChange={(event) => handleQueryChange(event.target.value)}
          placeholder="Example: I need help tracking my order."
          rows={6}
        />
        {validationError && <p className="field-error">{validationError}</p>}

        <button className="primary-button" type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Draft'}
        </button>
      </form>
    </section>
  );
}

export default QueryPanel;

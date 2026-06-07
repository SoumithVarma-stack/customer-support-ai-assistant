function getConfidence(matchCount) {
  if (matchCount >= 3) {
    return 'high';
  }

  if (matchCount >= 1) {
    return 'medium';
  }

  return 'low';
}

function generateDraft(customerQuery, retrievedContext) {
  const confidence = getConfidence(retrievedContext.length);

  if (!retrievedContext.length) {
    return {
      confidence,
      draft: [
        'Thanks for reaching out. I want to make sure we give you the right answer.',
        `The customer asked: "${customerQuery}".`,
        'I could not find a strong match in the local support data, so please review this manually before sending a response.',
      ].join(' '),
    };
  }

  const contextSummary = retrievedContext
    .slice(0, 3)
    .map((item) => `- ${item.title}: ${item.summary}`)
    .join('\n');

  return {
    confidence,
    draft: [
      'Thanks for contacting support. Based on our support information, here is a suggested response:',
      '',
      contextSummary,
      '',
      'Please review this draft, adjust the wording if needed, and make sure it matches the customer situation before sending.',
    ].join('\n'),
  };
}

module.exports = {
  generateDraft,
};

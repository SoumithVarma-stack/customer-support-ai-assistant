const { generateGeminiDraft } = require('./llmService');

function getConfidence(matchCount) {
  if (matchCount >= 3) {
    return 'high';
  }

  if (matchCount >= 1) {
    return 'medium';
  }

  return 'low';
}

function isSimpleGreeting(customerQuery) {
  const normalizedQuery = customerQuery
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .trim();

  const greetings = new Set([
    'hello',
    'hi',
    'hey',
    'good morning',
    'good afternoon',
    'good evening',
  ]);

  return greetings.has(normalizedQuery);
}

function generateMockDraft(customerQuery, retrievedContext) {
  const confidence = getConfidence(retrievedContext.length);

  if (!retrievedContext.length) {
    if (isSimpleGreeting(customerQuery)) {
      return {
        confidence,
        draft: 'Hi, thanks for reaching out. How can our support team help you today?',
      };
    }

    return {
      confidence,
      draft: [
        "Hi, thanks for reaching out. I'm sorry for the trouble.",
        'We want to make sure we give you the right answer, so our support team will review the details and help with the next step.',
      ].join(' '),
    };
  }

  const contextText = retrievedContext
    .slice(0, 3)
    .map((item) => item.summary)
    .join(' ')
    .toLowerCase();

  if (
    contextText.includes('tracking') ||
    contextText.includes('shipping') ||
    contextText.includes('carrier') ||
    contextText.includes('order')
  ) {
    return {
      confidence,
      draft: [
        "Hi, I'm sorry for the trouble with your order.",
        'Tracking updates from the logistics partner can sometimes take time to appear because carrier scans may be delayed.',
        'Please check the tracking link in your shipping email or your order history page for the latest status.',
        'If the tracking still does not update or the delivery remains delayed, our support team can review the shipment details and help with the next step.',
      ].join(' '),
    };
  }

  return {
    confidence,
    draft: [
      "Hi, thanks for reaching out. I'm sorry for the trouble.",
      'Our support team can review the details and help with the next step.',
    ].join(' '),
  };
}

async function generateDraft(customerQuery, retrievedContext) {
  const confidence = getConfidence(retrievedContext.length);
  const geminiDraft = await generateGeminiDraft(customerQuery, retrievedContext, confidence);

  if (geminiDraft) {
    return {
      confidence,
      draft: geminiDraft,
    };
  }

  return generateMockDraft(customerQuery, retrievedContext);
}

module.exports = {
  generateDraft,
  generateMockDraft,
};

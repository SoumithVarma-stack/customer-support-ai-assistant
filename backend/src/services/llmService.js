const DEFAULT_MODEL = 'gemini-3.5-flash';

function formatContextForPrompt(retrievedContext) {
  if (!retrievedContext.length) {
    return 'No matching support context was found.';
  }

  return retrievedContext
    .map((item, index) => {
      const keywords = Array.isArray(item.matchedKeywords) && item.matchedKeywords.length
        ? item.matchedKeywords.join(', ')
        : 'none';

      return [
        `Context ${index + 1}`,
        `Source type: ${item.sourceType}`,
        `Title: ${item.title}`,
        `Summary: ${item.summary}`,
        `Matched keywords: ${keywords}`,
        `Score: ${typeof item.score === 'number' ? item.score : 'not available'}`,
      ].join('\n');
    })
    .join('\n\n');
}

function buildSupportDraftPrompt(customerQuery, retrievedContext, confidence) {
  const contextText = formatContextForPrompt(retrievedContext);
  const hasContext = retrievedContext.length > 0;

  return [
    'You are writing a draft response that a support agent can send to the customer after review.',
    'Do not explain your reasoning. Do not list retrieved documents. Do not mention internal context. Return only the customer-facing message.',
    '',
    'Customer-facing response rules:',
    '- The response is only a draft suggestion for a human agent.',
    '- Answer the customer directly.',
    '- Use the retrieved support context silently.',
    '- Do not list support records, FAQs, policies, tickets, titles, scores, or matched keywords.',
    '- Do not say "Based on our support information".',
    '- Do not mention retrieved context or internal documents.',
    '- Use a polite, professional, empathetic customer support tone.',
    '- Do not invent policy details.',
    '- Do not promise refunds, credits, cancellations, or delivery dates unless the context supports it.',
    '- If the context is weak or missing, still answer naturally but avoid policy-specific claims.',
    '- If the customer only sent a greeting, greet them back and ask how support can help.',
    '- If details are needed, politely say the support team can review the details.',
    '- Keep the response concise and customer-friendly.',
    '',
    `Confidence from retrieval: ${confidence}`,
    `Retrieved context available: ${hasContext ? 'yes' : 'no'}`,
    '',
    'Customer query:',
    customerQuery,
    '',
    'Internal retrieved support context. Use this only to write the customer-facing message:',
    contextText,
    '',
    'Return only the final customer-facing draft message.',
  ].join('\n');
}

async function generateGeminiDraft(customerQuery, retrievedContext, confidence) {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  const prompt = buildSupportDraftPrompt(customerQuery, retrievedContext, confidence);

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
      contents: prompt,
      config: {
        temperature: 0.3,
      },
    });

    const draft = response.text && response.text.trim();
    return draft || null;
  } catch (error) {
    console.error('Gemini draft generation failed:', error.message);
    return null;
  }
}

module.exports = {
  buildSupportDraftPrompt,
  generateGeminiDraft,
};

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'can',
  'for',
  'how',
  'i',
  'is',
  'it',
  'my',
  'of',
  'on',
  'or',
  'the',
  'to',
  'with',
]);

function tokenize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word && !STOP_WORDS.has(word));
}

function getSearchableText(record) {
  return [
    record.title,
    record.question,
    record.answer,
    record.description,
    record.issue,
    record.resolution,
    record.content,
    Array.isArray(record.tags) ? record.tags.join(' ') : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function getSummary(record) {
  return record.answer || record.description || record.resolution || record.content || '';
}

function keywordSearch(query, records, limit = 5) {
  const queryWords = tokenize(query);

  if (!queryWords.length) {
    return [];
  }

  return records
    .map((record) => {
      const searchableWords = tokenize(getSearchableText(record));
      const searchableSet = new Set(searchableWords);
      const matchedKeywords = queryWords.filter((word) => searchableSet.has(word));

      return {
        record,
        score: matchedKeywords.length,
        matchedKeywords: [...new Set(matchedKeywords)],
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((result) => ({
      id: result.record.id,
      sourceType: result.record.sourceType,
      title: result.record.title,
      summary: getSummary(result.record),
      matchedKeywords: result.matchedKeywords,
      score: result.score,
    }));
}

module.exports = {
  keywordSearch,
};

const express = require('express');

const { searchSupportData } = require('../services/dataService');
const { generateDraft } = require('../services/draftService');

const router = express.Router();

router.post('/draft', async (req, res, next) => {
  try {
    const { customerQuery } = req.body;

    if (!customerQuery || typeof customerQuery !== 'string' || !customerQuery.trim()) {
      return res.status(400).json({
        error: 'customerQuery is required.',
      });
    }

    const cleanQuery = customerQuery.trim();
    const retrievedContext = await searchSupportData(cleanQuery);
    const draftResult = await generateDraft(cleanQuery, retrievedContext);

    return res.status(200).json({
      customerQuery: cleanQuery,
      retrievedContext,
      draft: draftResult.draft,
      confidence: draftResult.confidence,
      status: 'draft_generated',
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

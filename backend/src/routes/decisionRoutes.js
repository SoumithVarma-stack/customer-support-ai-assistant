const express = require('express');

const { saveAuditRecord } = require('../services/auditService');

const router = express.Router();

router.post('/approve', async (req, res, next) => {
  try {
    const { customerQuery, originalDraft, finalResponse, feedback } = req.body;

    if (!customerQuery || typeof customerQuery !== 'string' || !customerQuery.trim()) {
      return res.status(400).json({ error: 'customerQuery is required.' });
    }

    if (!originalDraft || typeof originalDraft !== 'string' || !originalDraft.trim()) {
      return res.status(400).json({ error: 'originalDraft is required.' });
    }

    if (!finalResponse || typeof finalResponse !== 'string' || !finalResponse.trim()) {
      return res.status(400).json({ error: 'finalResponse is required.' });
    }

    const auditRecord = await saveAuditRecord({
      customerQuery: customerQuery.trim(),
      originalDraft: originalDraft.trim(),
      finalResponse: finalResponse.trim(),
      feedback: typeof feedback === 'string' ? feedback.trim() : '',
      status: 'approved',
    });

    return res.status(201).json(auditRecord);
  } catch (error) {
    return next(error);
  }
});

router.post('/reject', async (req, res, next) => {
  try {
    const { customerQuery, originalDraft, feedback } = req.body;

    if (!customerQuery || typeof customerQuery !== 'string' || !customerQuery.trim()) {
      return res.status(400).json({ error: 'customerQuery is required.' });
    }

    if (!originalDraft || typeof originalDraft !== 'string' || !originalDraft.trim()) {
      return res.status(400).json({ error: 'originalDraft is required.' });
    }

    if (!feedback || typeof feedback !== 'string' || !feedback.trim()) {
      return res.status(400).json({ error: 'feedback is required for rejected drafts.' });
    }

    const auditRecord = await saveAuditRecord({
      customerQuery: customerQuery.trim(),
      originalDraft: originalDraft.trim(),
      feedback: feedback.trim(),
      status: 'rejected',
    });

    return res.status(201).json(auditRecord);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

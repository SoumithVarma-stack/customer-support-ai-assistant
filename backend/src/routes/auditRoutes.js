const express = require('express');

const { getAuditLogs } = require('../services/auditService');

const router = express.Router();

router.get('/audit-logs', async (req, res, next) => {
  try {
    const auditLogs = await getAuditLogs();
    return res.status(200).json(auditLogs);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

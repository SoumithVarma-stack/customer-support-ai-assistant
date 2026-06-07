const fs = require('fs/promises');
const path = require('path');

const auditLogPath = path.join(__dirname, '../../data/audit_logs.json');

async function readAuditLogs() {
  try {
    const fileContent = await fs.readFile(auditLogPath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Could not read audit logs:', error.message);
    throw new Error('Could not read audit logs.');
  }
}

async function writeAuditLogs(auditLogs) {
  try {
    await fs.writeFile(auditLogPath, JSON.stringify(auditLogs, null, 2));
  } catch (error) {
    console.error('Could not write audit logs:', error.message);
    throw new Error('Could not save audit log.');
  }
}

async function saveAuditRecord(record) {
  const auditLogs = await readAuditLogs();

  const auditRecord = {
    id: `audit_${Date.now()}`,
    ...record,
    timestamp: new Date().toISOString(),
  };

  auditLogs.push(auditRecord);
  await writeAuditLogs(auditLogs);

  return auditRecord;
}

async function getAuditLogs() {
  return readAuditLogs();
}

module.exports = {
  saveAuditRecord,
  getAuditLogs,
};

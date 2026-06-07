const fs = require('fs/promises');
const path = require('path');

const { keywordSearch } = require('../utils/keywordSearch');

const dataDirectory = path.join(__dirname, '../../data');

async function readJsonFile(fileName) {
  const filePath = path.join(dataDirectory, fileName);

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Could not read ${fileName}:`, error.message);
    throw new Error(`Could not read local support data from ${fileName}.`);
  }
}

async function getSupportData() {
  const [faqs, policies, sampleTickets] = await Promise.all([
    readJsonFile('faqs.json'),
    readJsonFile('policies.json'),
    readJsonFile('sample_tickets.json'),
  ]);

  return [
    ...faqs.map((record) => ({ ...record, sourceType: 'faq' })),
    ...policies.map((record) => ({ ...record, sourceType: 'policy' })),
    ...sampleTickets.map((record) => ({ ...record, sourceType: 'sample_ticket' })),
  ];
}

async function searchSupportData(customerQuery) {
  const supportData = await getSupportData();
  return keywordSearch(customerQuery, supportData, 5);
}

module.exports = {
  searchSupportData,
};

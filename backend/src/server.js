const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const healthRoutes = require('./routes/healthRoutes');
const draftRoutes = require('./routes/draftRoutes');
const decisionRoutes = require('./routes/decisionRoutes');
const auditRoutes = require('./routes/auditRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api', draftRoutes);
app.use('/api', decisionRoutes);
app.use('/api', auditRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Something went wrong on the server.',
  });
});

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});

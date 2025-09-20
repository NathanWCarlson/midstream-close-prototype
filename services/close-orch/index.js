const express = require('express');
const app = express();
const port = process.env.PORT || 3003;

app.get('/health', (req, res) => res.send('Close Orchestration Service Healthy'));

app.listen(port, () => console.log(`Close Orchestration Service listening on port ${port}`));

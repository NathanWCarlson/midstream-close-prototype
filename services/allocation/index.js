const express = require('express');
const app = express();
const port = process.env.PORT || 3002;

app.get('/health', (req, res) => res.send('Allocation Service Healthy'));

app.listen(port, () => console.log(`Allocation Service listening on port ${port}`));

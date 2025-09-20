const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

let tickets = [];
let nextId = 1;

// CRUD API
app.get('/api/tickets', (req, res) => res.json(tickets));

app.post('/api/tickets', (req, res) => {
  const { title, description, assignee } = req.body;
  const ticket = { id: nextId++, title, description, assignee: assignee || null, status: 'open', notes: [] };
  tickets.push(ticket);
  // TODO: trigger Power Platform event
  res.status(201).json(ticket);
});

app.put('/api/tickets/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const ticket = tickets.find(t => t.id === id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
  const { status, assignee, note } = req.body;
  if (status) ticket.status = status;
  if (assignee) ticket.assignee = assignee;
  if (note) ticket.notes.push({ timestamp: new Date().toISOString(), text: note });
  res.json(ticket);
});

app.delete('/api/tickets/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  tickets = tickets.filter(t => t.id !== id);
  res.status(204).end();
});

// Serve UI
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

const port = process.env.PORT || 3004;
app.listen(port, () => console.log(`Ticket Service listening on port ${port}`));

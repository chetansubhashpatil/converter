const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

var bip_default = '{"dataModelUrl":"/chetan/simple/datamodel.xdm","startDate":"2024-03-028T11:45:00.000","endDate":"2024-03-29T19:45:00.000","recurrenceExpression":"0 0 12 * * ?","reportRequest":{"reportAbsolutePath":"/chetan/simple/report.xdo"}}';

// POST convert request
app.post('/api/convert', (req, res) => {
    const request = req.body;
    console.log(request);
    res.status(200).json(bip_default);
  });

/*
// Sample data (you can replace this with a database)
let todos = [
  { id: 1, text: 'Learn Node.js', done: false },
  { id: 2, text: 'Build a REST API', done: false }
];

// GET all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// GET todo by ID
app.get('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(todo => todo.id === id);
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  res.json(todo);
});

// POST a new todo
app.post('/api/todos', (req, res) => {
  const todo = req.body;
  todos.push(todo);
  res.status(201).json(todo);
});

// PUT (update) a todo by ID
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  todos[index] = { ...todos[index], ...req.body };
  res.json(todos[index]);
});

// DELETE a todo by ID
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== id);
  res.status(204).end();
});
*/

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

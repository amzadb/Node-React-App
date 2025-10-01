import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 5000;
const DATA_FILE = 'employees.json';

app.use(cors());
app.use(bodyParser.json());

// Helper to read/write employees
function readEmployees() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function writeEmployees(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get all employees
app.get('/api/employees', (req, res) => {
  res.json(readEmployees());
});

// Add new employee
app.post('/api/employees', (req, res) => {
  const employees = readEmployees();
  const newEmp = { id: Date.now(), ...req.body };
  employees.push(newEmp);
  writeEmployees(employees);
  res.status(201).json(newEmp);
});

// Update employee
app.put('/api/employees/:id', (req, res) => {
  const employees = readEmployees();
  const idx = employees.findIndex(e => e.id == req.params.id);
  if (idx === -1) return res.status(404).send('Not found');
  employees[idx] = { ...employees[idx], ...req.body };
  writeEmployees(employees);
  res.json(employees[idx]);
});

// Delete employee
app.delete('/api/employees/:id', (req, res) => {
  let employees = readEmployees();
  const idx = employees.findIndex(e => e.id == req.params.id);
  if (idx === -1) return res.status(404).send('Not found');
  const removed = employees[idx];
  employees = employees.filter(e => e.id != req.params.id);
  writeEmployees(employees);
  res.json(removed);
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

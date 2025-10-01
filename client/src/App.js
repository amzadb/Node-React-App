
import React, { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api/employees';

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: '', role: '' });
  const [editId, setEditId] = useState(null);

  // Fetch employees
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setEmployees);
  }, []);

  // Handle form change
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update employee
  const handleSubmit = e => {
    e.preventDefault();
    if (editId) {
      fetch(`${API_URL}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
        .then(res => res.json())
        .then(updated => {
          setEmployees(employees.map(emp => (emp.id === updated.id ? updated : emp)));
          setEditId(null);
          setForm({ name: '', role: '' });
        });
    } else {
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
        .then(res => res.json())
        .then(newEmp => {
          setEmployees([...employees, newEmp]);
          setForm({ name: '', role: '' });
        });
    }
  };

  // Edit employee
  const handleEdit = emp => {
    setEditId(emp.id);
    setForm({ name: emp.name, role: emp.role });
  };

  // Delete employee
  const handleDelete = id => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        setEmployees(employees.filter(emp => emp.id !== id));
        if (editId === id) {
          setEditId(null);
          setForm({ name: '', role: '' });
        }
      });
  };

  return (
    <div className="App">
      <h1>Employee CRUD</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="role"
          placeholder="Role"
          value={form.role}
          onChange={handleChange}
          required
        />
        <button type="submit">{editId ? 'Update' : 'Add'} Employee</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: '', role: '' }); }}>Cancel</button>}
      </form>
      <table style={{ margin: 'auto', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Name</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Role</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{emp.name}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{emp.role}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>
                <button onClick={() => handleEdit(emp)}>Edit</button>
                <button onClick={() => handleDelete(emp.id)} style={{ marginLeft: 8 }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

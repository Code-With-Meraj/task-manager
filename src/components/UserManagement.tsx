import React, { useState, useEffect } from "react";
import "./UserManagement.css";

interface User {
  id: number;
  name: string;
  email: string;
}

const API_URL = "https://jsonplaceholder.typicode.com/users";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const addUser = () => {
    if (!newUser.name || !newUser.email) {
      alert("Please enter both Name and Email");
      return;
    }

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((data) => setUsers([...users, data]))
      .catch((err) => console.error("Error adding user:", err));

    setNewUser({ name: "", email: "" });
  };

  const deleteUser = (id: number) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => setUsers(users.filter((user) => user.id !== id)))
      .catch((err) => console.error("Error deleting user:", err));
  };

  const editUser = (user: User) => {
    setEditingUser(user);
  };

  const updateUser = () => {
    if (editingUser) {
      fetch(`${API_URL}/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      })
        .then(() => {
          setUsers(
            users.map((user) =>
              user.id === editingUser.id ? editingUser : user
            )
          );
          setEditingUser(null);
        })
        .catch((err) => console.error("Error updating user:", err));
    }
  };

  return (
    <div className="container">
      <h2>User Management (CRUD)</h2>

      <div className="form-container">
        <label>
          Name:
          <input
            type="text"
            placeholder="Enter name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            placeholder="Enter email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
        </label>
        <button onClick={addUser}>Add User</button>
      </div>

      {editingUser && (
        <div className="form-container">
          <label>
            Name:
            <input
              type="text"
              placeholder="Enter name"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              placeholder="Enter email"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
            />
          </label>
          <button onClick={updateUser}>Update</button>
        </div>
      )}

      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <div>
              <strong>{user.name}</strong> <br />
              <span>{user.email}</span>
            </div>
            <div>
              <button onClick={() => editUser(user)}>✏️ Edit</button>
              <button onClick={() => deleteUser(user.id)}>❌ Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;

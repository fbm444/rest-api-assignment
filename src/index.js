const express = require("express");
const crypto = require("crypto");
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// **************************************************************
// Put your implementation here
// If necessary to add imports, please do so in the section above

// In-memory array to store users
let users = [];

// Helper function to find user by ID
const findUserById = (id) => {
  return users.find((user) => user.id === id);
};

// Helper function to validate user data
const validateUserData = (userData) => {
  if (!userData.name || !userData.email) {
    return false;
  }
  return true;
};

// POST /users - Create a new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  // Create new user
  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
  };

  // Add user to array
  users.push(newUser);

  // Return 201 Created with user data
  res.status(201).json(newUser);
});

// GET /users/:id 
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = findUserById(id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(user);
});

// PUT /users/:id 
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users[userIndex] = {
    id,
    name,
    email,
  };

  res.status(200).json(users[userIndex]);
});

// DELETE /users/:id
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users.splice(userIndex, 1);

  res.status(204).send();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Do not touch the code below this comment
// **************************************************************

// Start the server (only if not in test mode)
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = app; // Export the app for testing

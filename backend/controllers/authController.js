const fs = require("fs-extra");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const filePath = path.join(__dirname, "../data/users.json");

// helper to read users
exports.getUsers = async (req, res) => {
  res.json([
    { id: "admin-user", name: "Admin", email: "admin@test.com", role: "Admin" },
    { id: "member-user", name: "Member", email: "member@test.com", role: "Member" }
  ]);
};

// helper to save users
const saveUsers = async (users) => {
  await fs.writeJson(filePath, users);
};

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let users = await getUsers();

    // check if exists
    const userExists = users.find(u => u.email === email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role
    };

    users.push(newUser);
    await saveUsers(users);

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // ADMIN
  if (email === "admin@test.com" && password === "123456") {
    return res.json({
      token: "dummy-token",
      user: {
        id: "admin-user",
        name: "Admin",
        role: "Admin"
      }
    });
  }

  // MEMBER
  if (email === "member@test.com" && password === "123456") {
    return res.json({
      token: "dummy-token",
      user: {
        id: "member-user",
        name: "Member",
        role: "Member"
      }
    });
  }

  return res.status(400).json({ message: "Invalid credentials" });
};

exports.getUsers = async (req, res) => {
  try {
    const users = await getUsers();

    const safeUsers = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role
    }));

    res.json(safeUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
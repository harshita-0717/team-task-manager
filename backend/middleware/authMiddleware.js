// const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  // 👇 Fake user (for demo)
  req.user = {
    id: "demo-user",
    role: "Admin"
  };

  next();
};
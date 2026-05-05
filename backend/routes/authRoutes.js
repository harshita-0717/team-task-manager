const express = require("express");
const router = express.Router();
const { signup, login, getUsers } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", auth, getUsers);

module.exports = router;
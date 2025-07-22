const express = require("express");
const router = express.Router();

// Dummy user for demonstration
const USER = { username: "admin", password: "1234" };

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    res.json({ success: true, message: "Login successful" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

module.exports = router;

const bcrypt = require("bcrypt");
const { db } = require("../config/db");
const { generateToken } = require("../utils/jwt");

const signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('hi, inside try block');
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, hashedPassword, role || 'user']
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).send("User not found");
    }
    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send("Invalid password");
    }
    const token = generateToken(user);
    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("Error logging in");
  }
};

module.exports = {
  login,
  signUp
};

const { db } = require("../config/db");

const getAllUsers = async () => {
  try {
    const result = await db.query("SELECT * FROM users");
    return result.rows;
  } catch (err) {
    console.error("Error getting users", err);
    return [];
  }
};

const getUser = async (id) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
    } catch (err) {
    console.error("Error getting user", err);
    return null;
    }
};

const deleteUser = async (id) => {
  try {
    await db.query("DELETE FROM users WHERE id = $1", [id]);
    return true;
  } catch (err) {
    console.error("Error deleting user", err);
    return false;
  }
};

module.exports = { 
  getAllUsers,
  getUser,
  deleteUser
};
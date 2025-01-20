const { db } = require("../config/db");

const getAllTasks = async () => {
  try {
    const result = await db.query("SELECT * FROM tasks");
    return result.rows;
  } catch (err) {
    console.error("Error getting tasks", err);
    return [];
  }
};

const getTask = async (id) => {
  try {
    const result = await db.query("SELECT * FROM tasks WHERE id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    console.error("Error getting task", err);
    return null;
  }
};

const createTask = async (title, description, assignee_id) => {
  try {
    const result = await db.query(
      "INSERT INTO tasks (title, description, assignee_id) VALUES ($1, $2, $3) RETURNING *",
      [title, description, assignee_id]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error creating task", err);
    return null;
  }
};

const updateTask = async (id, title, description, priority, status) => {
  console.log("hi");
  try {
    const result = await db.query(
      "UPDATE tasks SET title = $1, description = $2, priority = $3, status = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *",
      [title, description, priority, status, id]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error updating task", err);
    return null;
  }
};

const deleteTask = async (id) => {
  try {
    await db.query("DELETE FROM tasks WHERE id = $1", [id]);
    return true;
  } catch (err) {
    console.error("Error deleting task", err);
    return false;
  }
};

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};

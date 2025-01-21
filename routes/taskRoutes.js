const express = require('express');
const Authenticate = require("../middlewares/authMiddleware");
const { getAllTasks, getTask, createTask, updateTask, deleteTask } = require('../models/taskModel');
const { getRedisClient } = require("../config/redis");


const router = express.Router();

router.use(Authenticate());

router.get('/tasks-list', async (req, res) => {
  try {
    const redisClient = getRedisClient();
    const cachedTasks = await redisClient.get("tasksList");
    if (cachedTasks) {
      console.log("data from cache");
      return res.json(JSON.parse(cachedTasks));
    }
    const tasks = await getAllTasks();
    await redisClient.set("tasksList", JSON.stringify(tasks), {
      EX: 3600, 
    });
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).send("Error getting tasks");
  }
});

router.get('/:id', async (req, res) => {
  try {
    const task = await getTask(req.params.id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).send('Task not found');
    }
  } catch (err) {
    res.status(500).send('Error getting task');
  }
});

router.post('/new-task', async (req, res) => {
  try {
    const task = await createTask(req.body.title, req.body.description, req.user.assignee_id, req.body.priority);
    res.json(task);
  } catch (err) {
    res.status(500).send('Error creating task');
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const task = await updateTask(req.params.id, req.body.title, req.body.description, req.body.priority, req.body.status);
    if (task) {
      res.json(task);
    } else {
      res.status(404).send('Task not found');
    }
  } catch (err) {
    res.status(500).send('Error updating task');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteTask(req.params.id);
    if (deleted) {
      res.send('Task deleted successfully');
    } else {
      res.status(500).send('Error deleting task');
    }
  } catch (err) {
    res.status(500).send('Error deleting task');
  }
});

module.exports = router;
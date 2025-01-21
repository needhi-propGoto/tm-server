const express = require("express");
const { getAllUsers, deleteUser, getUser } = require("../models/userModel");
const Authenticate = require("../middlewares/authMiddleware");
const { getRedisClient } = require("../config/redis");

const router = express.Router();

router.use(Authenticate());

router.get("/users-list", async (req, res) => {
  try {
    console.log("hi");
    const redisClient = getRedisClient();

    const cachedUsersList = await redisClient.get("usersList");
    if (cachedUsersList) {
      console.log("data from cache");
      return res.json(JSON.parse(cachedUsersList));
    }
    const users = await getAllUsers();

    await redisClient.set("usersList", JSON.stringify(users), {
      EX: 3600, 
    });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Error getting users");
  }
});


router.get("/:id", async (req, res) => {
  try {
    const redisClient = getRedisClient();
    const user = await getUser(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(500).send("Error getting user");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteUser(req.params.id);
    if (deleted) {
      res.send("User deleted successfully");
    } else {
      res.status(500).send("Error deleting user");
    }
  } catch (err) {
    res.status(500).send("Error deleting user");
  }
});

module.exports = router;

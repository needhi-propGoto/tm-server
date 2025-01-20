const express = require("express");
const cors = require("cors");
const { connectDb } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
// app.get("/api/hello-world", (req, res) => {
//   res.send("Hello, world!");
// });
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);

const startServer = async () => {
  try {
    await connectDb();
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (e) {
    console.error("Error starting the server", e);
  }
};

startServer();
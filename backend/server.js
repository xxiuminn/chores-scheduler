require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const auth = require("./src/routers/auth");
const users = require("./src/routers/users");
const usergroups = require("./src/routers/usergroups");
const tasks = require("./src/routers/tasks");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

app.use(cors());
app.use(helmet());
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", auth);
app.use("/users", users);
app.use("/usergroups", usergroups);
app.use("/tasks", tasks);

const PORT = process.env.port || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const auth = require("./src/routers/auth");
const users = require("./src/routers/users");
const usergroups = require("./src/routers/usergroups");
const tasks = require("./src/routers/tasks");
const subscribe = require("./src/routers/subscription");
const verifypayment = require("./src/routers/subscription");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

app.use(cors());
app.use(helmet());
app.use(limiter);

// app.use(express.json());
// We need the raw body to verify webhook signatures.
app.use(
  express.json({
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith("/verifypayment/webhook")) {
        req.rawBody = buf.toString();
      }
    },
  })
);
app.use(express.urlencoded({ extended: false }));

app.use("/auth", auth);
app.use("/users", users);
app.use("/usergroups", usergroups);
app.use("/tasks", tasks);

app.use("/subscribe", subscribe);
app.use("/verifypayment", verifypayment);

const PORT = process.env.port || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

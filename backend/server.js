require("dotenv").config();

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const auth = require("./src/routers/auth");
const users = require("./src/routers/users");
const usergroups = require("./src/routers/usergroups");
const tasks = require("./src/routers/tasks");
const subscribe = require("./src/routers/subscription");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
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

app.use("/subscribe", subscribe);

//stripe payment - to separate into controllers & routers.
// app.post("/create-checkout-session", async (req, res) => {
//   try {
//     const session = await stripe.checkout.sessions.create({
//       mode: "subscription",
//       success_url: "http://localhost:5173/success",
//       cancel_url: "http://localhost:5173/subscribe",
//       line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
//     });
//     console.log("session: ", session.id, session.url, session);
//     // get id, save to user, return url
//     const sessionId = session.id;
//     console.log("sessionId: ", sessionId);
//     //save session.id to the user in the database
//     res.json({ url: session.url });
//   } catch (error) {
//     console.error(error.message);
//     res
//       .status(500)
//       .json({ status: "error", msg: "stripe error checkout session" });
//   }
// });

const PORT = process.env.port || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

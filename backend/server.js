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

// app.post("/webhook", async (req, res) => {
//   //to verify that the event comes from stripe.
//   let data;
//   let eventType;

//   const webhookSecret = process.env.STRIPE_ENDPOINT_SECRET;
//   if (webhookSecret) {
//     let event;
//     const sig = req.headers["stripe-signature"];

//     try {
//       event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
//     } catch (error) {
//       console.error(error.message);
//       return res.status(400).json({
//         status: "error",
//         message: "webhook signature verification failed",
//       });
//     }

//     data = event.data;
//     // console.log(data);
//     eventType = event.type;
//     console.log(eventType);
//   } else {
//     data = req.body.data;
//     eventType = req.body.type;
//   }

//   if (eventType === "checkout.session.completed") {
//     console.log("payment received!");
//     console.log(data.object.status);
//     // res.json(data.object.status)
//     // res.json({received: true})
//   }
//   // Return a response to acknowledge receipt of the event
//   res.json(data.object.status);
// });

const PORT = process.env.port || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

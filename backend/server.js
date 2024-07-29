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

app.post("/webhook", async (req, res) => {
  //to verify that the event comes from stripe.
  let data;
  let eventType;

  const webhookSecret = process.env.STRIPE_ENDPOINT_SECRET;
  if (webhookSecret) {
    let event;
    const sig = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (error) {
      console.error(error.message);
      return res.status(400).json({
        status: "error",
        message: "webhook signature verification failed",
      });
    }
    data = event.data;
    eventType = event.type;
  } else {
    data = req.body.data;
    eventType = req.body.type;
  }
  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      status = subscr;
      // stripe.customers.retrieve(data.customer);
      console.log(data.object);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case "invoice.payment_failed":
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
});

const PORT = process.env.port || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//stripe payment
const subscribe = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: "http://localhost:5173/subscribe",
      cancel_url: "http://localhost:5173/subscribe",
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    });
    console.log("session: ", session.id, session.url, session);
    // get id, save to user, return url
    const sessionId = session.id;
    console.log("sessionId: ", sessionId);
    //save session.id to the user in the database

    res.json({ url: session.url });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ status: "error", msg: "stripe error checkout session" });
  }
};

//stripe webhooks
// app.post("/webhook", async (req, res) => {
//   let data;
//   let eventType;

//   //to verify that the event comes from stripe.
//   let event;
//   const sig = req.headers["stripe-signature"];

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_ENDPOINT_SECRET
//     );
//   } catch (error) {
//     console.error(error.message);
//     return res.status(400).json({
//       status: "error",
//       message: "webhook signature verification failed",
//     });
//   }

//   // Handle the event
//   switch (event.type) {
//     case "checkout.session.completed":
//       console.log(event.data.object);
//       // Then define and call a method to handle the successful payment intent.
//       // handlePaymentIntentSucceeded(paymentIntent);
//       break;
//     case "invoice.paument_failed":
//       const paymentMethod = event.data.object;
//       // Then define and call a method to handle the successful attachment of a PaymentMethod.
//       // handlePaymentMethodAttached(paymentMethod);
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a response to acknowledge receipt of the event
//   response.json({ received: true });
// });

module.exports = { subscribe };

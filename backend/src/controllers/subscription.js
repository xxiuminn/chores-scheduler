const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//stripe payment
const subscribe = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: "http://localhost:5173/success",
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

//check paymentintent status
// const session = async (req, res) => {
//   try {
//     const status = await stripe.checkout.sessions.retrieve();
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ status: "error", msg: "stripe error" });
//   }
// };

module.exports = { subscribe };

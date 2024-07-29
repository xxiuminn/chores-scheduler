const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const db = require("../db/db");

//stripe payment
const subscribe = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: "http://localhost:5173/subscribe",
      cancel_url: "http://localhost:5173/subscribe",
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    });
    // console.log("session: ", session.id, session.url, session);

    const sessionId = session.id;
    // console.log("sessionId: ", sessionId);

    //save session.id to the user in the database
    //get group id using uuid
    const usergroupArr = await db.query(
      "SELECT group_id FROM users WHERE uuid=$1",
      [req.body.uuid]
    );
    console.log(usergroupArr.rows[0].group_id);
    const usergroup = usergroupArr.rows[0].group_id;
    console.log(usergroup);
    console.log(sessionId);
    // update stripe_session_id
    await db.query("UPDATE user_groups SET stripe_session_id=$1 WHERE id=$2", [
      sessionId,
      usergroup,
    ]);

    res.json({ url: session.url });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ status: "error", msg: "stripe error checkout session" });
  }
};

//stripe webhooks
const verifypayment = async (req, res) => {
  let data;
  let eventType;

  const webhookSecret = process.env.STRIPE_ENDPOINT_SECRET;
  if (webhookSecret) {
    let event;
    const sig = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } catch (error) {
      console.error(error.message);
      return res.status(400).json({
        status: "error",
        message: "webhook signature verification failed",
      });
    }

    data = event.data;
    console.log(data);
    eventType = event.type;
    // console.log(eventType);
  } else {
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "checkout.session.completed") {
    console.log("payment received!");
    console.log(data.object.status);
    console.log(data.object.id);

    await db.query(
      "UPDATE user_groups SET account_type='PAID' WHERE stripe_session_id=$1",
      [data.object.id]
    );
    // res.json(data.object.status)
    // res.json({received: true})
    return res.json({ status: "ok", message: "payment success" });
  } else return res.json({ received: true });
};

module.exports = { subscribe, verifypayment };

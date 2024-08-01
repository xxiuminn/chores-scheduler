const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const db = require("../db/db");

//stripe payment
const subscribe = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL,
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    });

    const sessionId = session.id;

    //save session.id to the user in the database
    //get group id using uuid
    const usergroupArr = await client.query(
      "SELECT group_id FROM users WHERE uuid=$1",
      [req.decoded.uuid]
    );
    console.log(usergroupArr);
    console.log(usergroupArr.rows[0].group_id);
    const usergroup = usergroupArr.rows[0].group_id;
    console.log(usergroup);
    console.log(sessionId);
    // update stripe_session_id
    await client.query(
      "UPDATE user_groups SET stripe_session_id=$1 WHERE id=$2",
      [sessionId, usergroup]
    );
    await client.query("COMMIT");
    res.json({ url: session.url });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error.message);
    res
      .status(500)
      .json({ status: "error", msg: "stripe error checkout session" });
  } finally {
    client.release();
  }
};

//stripe webhooks
const verifypayment = async (req, res) => {
  const client = await db.connect();
  try {
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
    } else {
      data = req.body.data;
      eventType = req.body.type;
    }

    if (eventType === "checkout.session.completed") {
      console.log("payment received!");
      console.log(data.object.status);
      console.log(data.object.id);

      await client.query(
        "UPDATE user_groups SET account_type='PAID' WHERE stripe_session_id=$1",
        [data.object.id]
      );
      await client.query("COMMIT");
      res.json({ status: "ok", message: "payment success" });
    } else res.json({ received: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error.message);
    res.status(500).json({ status: "error", msg: "stripe payment failed" });
  } finally {
    client.release();
  }
};

module.exports = { subscribe, verifypayment };

const express = require("express");
const router = express.Router();
const { subscribe, verifypayment } = require("../controllers/subscription");

router.post("/create-checkout-session", subscribe);
router.post("/webhook", verifypayment);

module.exports = router;

const express = require("express");
const router = express.Router();
const { subscribe, verifypayment } = require("../controllers/subscription");
const { authFree } = require("../middleware/auth");

router.post("/create-checkout-session", authFree, subscribe);
router.post("/webhook", verifypayment);

module.exports = router;

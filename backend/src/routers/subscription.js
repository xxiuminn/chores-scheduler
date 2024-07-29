const express = require("express");
const router = express.Router();
const { subscribe } = require("../controllers/subscription");

router.post("/create-checkout-session", subscribe);

module.exports = router;

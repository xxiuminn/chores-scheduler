const express = require("express");
const { createTaskGroup } = require("../controllers/tasks");
const router = express.Router();

router.put("/create", createTaskGroup);

module.exports = router;

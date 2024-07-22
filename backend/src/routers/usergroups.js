const express = require("express");
const router = express.Router();
const {
  seedAccountTypes,
  createUserGroup,
  updateAccountType,
} = require("../controllers/usergroups");

router.post("/seed/accounts", seedAccountTypes);
router.put("/usergroup", createUserGroup);
router.post("/accounttype", updateAccountType);

module.exports = router;

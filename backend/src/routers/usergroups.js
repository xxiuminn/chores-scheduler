const express = require("express");
const router = express.Router();
const {
  seedAccountTypes,
  createUserGroup,
  updateAccountType,
  getGroupMembers,
} = require("../controllers/usergroups");

router.post("/seed/accounts", seedAccountTypes);
router.put("/usergroup", createUserGroup);
router.post("/accounttype", updateAccountType);
router.post("/members", getGroupMembers);

module.exports = router;

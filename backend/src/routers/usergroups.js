const express = require("express");
const router = express.Router();
const {
  seedAccountTypes,
  createUserGroup,
  updateAccountType,
  getGroupMembers,
} = require("../controllers/usergroups");
const {
  validateCreateUserGroup,
  validateUpdateAccountType,
  validateGetGroupMembers,
} = require("../validators/usergroups");
const checkErrors = require("../validators/checkErrors");

router.post("/seed/accounts", seedAccountTypes);
router.put("/usergroup", validateCreateUserGroup, checkErrors, createUserGroup);
router.post(
  "/accounttype",
  validateUpdateAccountType,
  checkErrors,
  updateAccountType
);
router.post("/members", validateGetGroupMembers, checkErrors, getGroupMembers);

module.exports = router;

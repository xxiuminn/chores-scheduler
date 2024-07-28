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
const { auth, authFree } = require("../middleware/auth");

router.post("/seed/accounts", seedAccountTypes);
router.put(
  "/usergroup",
  auth,
  validateCreateUserGroup,
  checkErrors,
  createUserGroup
);
router.post(
  "/accounttype",
  authFree,
  validateUpdateAccountType,
  checkErrors,
  updateAccountType
);
router.post(
  "/members",
  authFree,
  validateGetGroupMembers,
  checkErrors,
  getGroupMembers
);

module.exports = router;

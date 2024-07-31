const express = require("express");
const {
  updateUserInfo,
  seedUsers,
  getUserInfo,
  getUserByEmail,
  getUser,
  inviteUser,
} = require("../controllers/users");
const router = express.Router();
const {
  validateUpdateUserInfo,
  validateGetUserByEmail,
  validateInviteUser,
  validateRemoveUser,
} = require("../validators/users");
const checkErrors = require("../validators/checkErrors");
const { auth, authFree } = require("../middleware/auth");

router.post("/seed", seedUsers);
router.patch(
  "/update",
  auth,
  validateUpdateUserInfo,
  checkErrors,
  updateUserInfo
);
router.get("/user", auth, getUser);
router.get("/userinfo", auth, getUserInfo);
router.get(
  "/invite/:email",
  authFree,
  validateGetUserByEmail,
  checkErrors,
  getUserByEmail
);
router.patch("/invite", authFree, validateInviteUser, checkErrors, inviteUser);
router.patch("/remove", authFree, validateRemoveUser, checkErrors, inviteUser);

module.exports = router;

const express = require("express");
const {
  updateUserInfo,
  seedUsers,
  getUserInfo,
  getUserByEmail,
} = require("../controllers/users");
const router = express.Router();
const {
  validateUpdateUserInfo,
  validateGetUserByEmail,
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
router.get("/userinfo", auth, getUserInfo);
router.get("/invite/:email", authFree, validateGetUserByEmail, getUserByEmail);

module.exports = router;

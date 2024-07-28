const express = require("express");
const {
  updateUserInfo,
  getUsers,
  seedUsers,
  getUserInfo,
  getUserByEmail,
} = require("../controllers/users");
const router = express.Router();
const {
  validateUpdateUserInfo,
  validateGetUserInfo,
  validateGetUserByEmail,
} = require("../validators/users");
const checkErrors = require("../validators/checkErrors");
const { auth, authFree } = require("../middleware/auth");

router.get("/users", getUsers); //might not need this
router.post("/seed", seedUsers);
router.patch(
  "/update",
  auth,
  validateUpdateUserInfo,
  checkErrors,
  updateUserInfo
);
router.get("/:uuid", auth, validateGetUserInfo, checkErrors, getUserInfo);
router.get("/invite/:email", authFree, validateGetUserByEmail, getUserByEmail);

module.exports = router;

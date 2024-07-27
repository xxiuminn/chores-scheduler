const express = require("express");
const {
  updateUserInfo,
  getUsers,
  seedUsers,
  getUserInfo,
} = require("../controllers/users");
const router = express.Router();
const {
  validateUpdateUserInfo,
  validateGetUserInfo,
} = require("../validators/users");
const checkErrors = require("../validators/checkErrors");

router.get("/users", getUsers);
router.post("/seed", seedUsers);
router.patch("/update", validateUpdateUserInfo, checkErrors, updateUserInfo);
router.get("/:uuid", validateGetUserInfo, checkErrors, getUserInfo);

module.exports = router;

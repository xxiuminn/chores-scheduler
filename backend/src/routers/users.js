const express = require("express");
const {
  updateUserInfo,
  getUsers,
  seedUsers,
  getUserInfo,
} = require("../controllers/users");
const router = express.Router();

router.get("/users", getUsers);
router.post("/seed", seedUsers);
router.patch("/update", updateUserInfo);
router.post("/user", getUserInfo);

module.exports = router;

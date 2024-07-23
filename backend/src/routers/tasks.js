const express = require("express");
const {
  createTaskGroup,
  getTasksByUserGroup,
  getTasksByUser,
  getTask,
  delTask,
  delAllTasks,
  delFollowingTasks,
  updateTask,
  updateAllTasks,
  updateFollowingTasks,
} = require("../controllers/tasks");
const router = express.Router();

router.put("/create", createTaskGroup);
router.post("/usergroup", getTasksByUserGroup);
router.post("/user", getTasksByUser);
router.post("/task", getTask);
router.delete("/deleteone", delTask);
router.delete("/deleteall", delAllTasks);
router.delete("/deletefollowing", delFollowingTasks);
router.post("/updateone", updateTask);
router.post("/updateall", updateAllTasks);
router.post("/updatefollowing", updateFollowingTasks);

module.exports = router;

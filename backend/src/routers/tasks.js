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

const {
  validateCreateTaskGroup,
  validateGetTaskByUserGroup,
  validateGetTaskByUser,
  validateGetTask,
  validateDelTask,
  validateUpdateTask,
} = require("../validators/tasks");

const checkErrors = require("../validators/checkErrors");

router.put("/create", validateCreateTaskGroup, checkErrors, createTaskGroup);
router.post(
  "/usergroup",
  validateGetTaskByUserGroup,
  checkErrors,
  getTasksByUserGroup
);
router.post("/user", validateGetTaskByUser, checkErrors, getTasksByUser);
router.post("/task", validateGetTask, checkErrors, getTask);
router.delete("/deleteone", validateDelTask, checkErrors, delTask);
router.delete("/deleteall", validateDelTask, checkErrors, delAllTasks);
router.delete(
  "/deletefollowing",
  validateDelTask,
  checkErrors,
  delFollowingTasks
);
router.post("/updateone", validateUpdateTask, checkErrors, updateTask);
router.post("/updateall", validateUpdateTask, checkErrors, updateAllTasks);
router.post(
  "/updatefollowing",
  validateUpdateTask,
  checkErrors,
  updateFollowingTasks
);

module.exports = router;

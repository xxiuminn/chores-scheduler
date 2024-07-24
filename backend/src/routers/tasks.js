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
  validateDelAllTasks,
  validateDelFollowingTasks,
  validateUpdateTask,
} = require("../validators/tasks");

const checkErrors = require("../validators/checkErrors");
const { check } = require("express-validator");

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
router.delete("/deleteall", validateDelAllTasks, checkErrors, delAllTasks);
router.delete(
  "/deletefollowing",
  validateDelFollowingTasks,
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

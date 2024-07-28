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
const { authFree, authPaid, auth } = require("../middleware/auth");

//need to add one more controller for the free version.
router.put(
  "/create",
  authFree,
  validateCreateTaskGroup,
  checkErrors,
  createTaskGroup
);
router.post(
  "/usergroup",
  authFree,
  validateGetTaskByUserGroup,
  checkErrors,
  getTasksByUserGroup
);
router.post(
  "/user",
  authFree,
  validateGetTaskByUser,
  checkErrors,
  getTasksByUser
);
router.get("/:task_id", authFree, validateGetTask, checkErrors, getTask);
router.delete("/deleteone", authFree, validateDelTask, checkErrors, delTask);
router.delete(
  "/deleteall",
  authPaid,
  validateDelTask,
  checkErrors,
  delAllTasks
);
router.delete(
  "/deletefollowing",
  authPaid,
  validateDelTask,
  checkErrors,
  delFollowingTasks
);
router.patch(
  "/updateone",
  authFree,
  validateUpdateTask,
  checkErrors,
  updateTask
);
router.patch(
  "/updateall",
  authPaid,
  validateUpdateTask,
  checkErrors,
  updateAllTasks
);
router.patch(
  "/updatefollowing",
  authPaid,
  validateUpdateTask,
  checkErrors,
  updateFollowingTasks
);

module.exports = router;

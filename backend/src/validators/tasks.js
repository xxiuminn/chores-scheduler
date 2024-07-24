const { body } = require("express-validator");

const validateCreateTaskGroup = [
  body("usergroup_id", "user group id is required").notEmpty().isInt(),
  body("assigned_user", "assigned user is required").notEmpty().isString(),
  body("is_recurring", "is recurring is required").notEmpty().isInt(),
  body("title", "title is required").notEmpty().isString(),
  body("deadline", "deadline is required").notEmpty().isDate(),
  body("is_rotate", "is rotate is required").optional().notEmpty().isInt(),
  body("rule", "rule is required").optional().notEmpty().isString(),
  body("created_by", "created by is required").notEmpty().isString(),
];

const validateGetTaskByUserGroup = [
  body("usergroup_id", "user group is required").notEmpty().isInt(),
];

const validateGetTaskByUser = [
  body("assigned_user", "assigned user required").notEmpty().isString(),
];

const validateGetTask = [
  body("task_id", "task_id is required").notEmpty().isInt(),
];

const validateDelTask = [
  body("task_id", "task_id is required").notEmpty().isInt(),
];

const validateUpdateTask = [
  body("task_id", "task id is required").notEmpty().isInt(),
];

module.exports = {
  validateCreateTaskGroup,
  validateGetTaskByUserGroup,
  validateGetTaskByUser,
  validateGetTask,
  validateDelTask,
  validateUpdateTask,
};

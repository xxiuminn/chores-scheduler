const { body, param } = require("express-validator");

const validateCreateUserGroup = [
  body("usergroup_name", "usergroup name required").notEmpty().isString(),
  body("account_type", "account type required").notEmpty().isString(),
  body("uuid", "uuid is required").notEmpty().isString(),
];

const validateUpdateAccountType = [
  body("usergroup_id", "user group id is required").notEmpty().isInt(),
  body("account_type", "account type required").notEmpty().isString(),
];

const validateGetGroupMembers = [
  body("usergroup_id", "user group id required").notEmpty().isInt(),
  // body("membership", "membership is required").notEmpty().isString(),
];
module.exports = {
  validateCreateUserGroup,
  validateUpdateAccountType,
  validateGetGroupMembers,
};

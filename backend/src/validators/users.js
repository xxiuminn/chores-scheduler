const { body, param } = require("express-validator");

const validateUpdateUserInfo = [
  body("name", "name is required").optional().notEmpty().isString(),
];

const validateGetUserByEmail = [
  param("email", "email is required").notEmpty().isEmail(),
];

const validateInviteUser = [
  body("group_id", "group id is required").notEmpty().isInt(),
  body("membership", "membership is required").notEmpty().isString(),
  body("uuid", "uuid is required").notEmpty().isString(),
];

const validateRemoveUser = [
  body("uuid", "uuid is required").notEmpty().isString(),
];

module.exports = {
  validateUpdateUserInfo,
  validateGetUserByEmail,
  validateInviteUser,
  validateRemoveUser,
};

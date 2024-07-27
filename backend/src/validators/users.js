const { body, param } = require("express-validator");

const validateGetUserInfo = [
  param("uuid", "user id is required").notEmpty().isString(),
];

const validateUpdateUserInfo = [
  body("uuid", "uuid is required").notEmpty().isString(),
  body("name", "name is required").optional().notEmpty().isString(),
];

const validateGetUserByEmail = [
  param("email", "email is required").notEmpty().isEmail(),
];

module.exports = {
  validateGetUserInfo,
  validateUpdateUserInfo,
  validateGetUserByEmail,
};

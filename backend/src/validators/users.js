const { body, param } = require("express-validator");

const validateUpdateUserInfo = [
  body("name", "name is required").optional().notEmpty().isString(),
];

const validateGetUserByEmail = [
  param("email", "email is required").notEmpty().isEmail(),
];

module.exports = {
  validateUpdateUserInfo,
  validateGetUserByEmail,
};

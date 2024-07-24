const { body } = require("express-validator");

const validateGetUserInfo = [
  body("uuid", "user id is required").notEmpty().isString(),
];

const validateUpdateUserInfo = [
  body("uuid", "uuid is required").notEmpty().isString(),
  body("name", "name is required").optional().notEmpty().isString(),
];

module.exports = {
  validateGetUserInfo,
  validateUpdateUserInfo,
};

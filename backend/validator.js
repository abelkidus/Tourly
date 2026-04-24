const { body, validationResult } = require("express-validator");

const signupValidationRules = [
  body("fullName").trim().notEmpty().withMessage("Full name is required").isLength({ min: 3 }).withMessage("Full name must be at least 3 characters long"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .matches(/^[a-z0-9_]+$/)
    .withMessage("Username can only contain lowercaseletters, numbers, and underscores"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\+?[0-9]{10,15}$/)
    .withMessage("Phone number must be 10 to 15 digits"),

  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Please enter a valid email address").normalizeEmail(),

  body("address").trim().notEmpty().withMessage("Address is required").isLength({ min: 4 }).withMessage("Address must be at least 4 characters long"),

  body("birthDate").notEmpty().withMessage("Birth date is required").isISO8601().withMessage("Birth date must be a valid date"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character"),
];

const validateSignup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }

  next();
};

module.exports = {
  signupValidationRules,
  validateSignup,
};

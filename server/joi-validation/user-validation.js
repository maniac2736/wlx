const Joi = require("joi");

const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const userSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(10).required(),
  lastName: Joi.string().trim().min(1).max(10).required(),
  address: Joi.string().trim().min(1).max(29).required(),
  contact: Joi.string()
    .trim()
    .pattern(/^[0-9]+$/)
    .min(7)
    .max(20)
    .required()
    .messages({
      "string.pattern.base": "Contact number must only contain digits.",
    }),
  email: Joi.string().email().required(),
  username: Joi.string().trim().min(1).max(15).required(),
  password: Joi.string().pattern(PASSWORD_REGEX).required().messages({
    "string.pattern.base":
      "Password must be at least 8 characters long and include at least one letter, one number, and one special character.",
  }),
  image: Joi.string().optional().allow(null, ""),
  role: Joi.number().valid(1, 2, 3).optional(),
});

const updateUserSchema = userSchema.fork(
  [
    "firstName",
    "lastName",
    "address",
    "contact",
    "email",
    "username",
    "password",
  ],
  (field) => field.optional(),
);

module.exports = {
  userSchema,
  updateUserSchema,
  PASSWORD_REGEX,
};

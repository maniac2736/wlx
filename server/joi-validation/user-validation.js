const Joi = require("joi");

const userSchema = Joi.object({
  firstName: Joi.string().min(1).max(255).required(),
  lastName: Joi.string().min(1).max(255).required(),
  address: Joi.string().min(1).max(255).required(),
  contact: Joi.string().min(1).max(255).required(),
  email: Joi.string().required(),
  username: Joi.string().min(1).max(255).required(),
  password: Joi.string().min(6).max(255).required(),
  image: Joi.string().optional(),
});

module.exports = {
  userSchema,
};

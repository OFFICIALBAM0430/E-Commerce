const Joi = require("joi");

const registerSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d).+$"))
        .message({
            "string.min": "Password must be at least 8 characters long",
            "string.pattern.base": "Password must contain at least one letter and one number"
        })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = { registerSchema, loginSchema };
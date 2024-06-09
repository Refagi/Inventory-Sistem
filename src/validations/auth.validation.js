const Joi = require('joi');
const { password, jwtRefresh } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required()
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required()
  })
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required()
  })
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens
};
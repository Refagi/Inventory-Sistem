const Joi = require('joi');
const { objectId, password } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    name:  Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required(),
    password: Joi.string().custom(password).required(),
    role: Joi.string().required()       
  }),
};

const getUserByEmail = {
  params: Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required()
    .messages({'any.required': 'email is required'})
  })
};

const getUsersById = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId)
  })
};

const updateUserById = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId)
  }),
  body: Joi.object().keys({
    name:  Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }),
    password: Joi.string().custom(password),
    role: Joi.string()
  }).min(1)
};

const deleteUserById = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required()
  })
};


module.exports = {
  createUser,
  getUserByEmail,
  getUsersById,
  updateUserById,
  deleteUserById
}
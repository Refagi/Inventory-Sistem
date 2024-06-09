const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    date: Joi.date().iso().messages({
      'date.format': 'Date must be in ISO format (YYYY-MM-DD)'
    }).required(),
    totalPrice: Joi.number().positive(),              
    customerName: Joi.string().required(), 
    customerEmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required(), 
    userId: Joi.string().custom(objectId).required()      
  })
};

const getOrderById = {
  params: Joi.object().keys({
    orderId: Joi.string().required().custom(objectId)
  })
};

const updateOrderById = {
  params: Joi.object().keys({
    orderId: Joi.string().required().custom(objectId)
  }),
  body: Joi.object().keys({
    date: Joi.date().iso().required().messages({
      'date.format': 'Date must be in ISO format (YYYY-MM-DD)'}),   
    totalPrice: Joi.number().positive(),                   
    customerName: Joi.string().required(), 
    customerEmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required(), 
    userId: Joi.string().custom(objectId).required()      
  })
};

const deleteOrderById = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required()
  })
};

const getOrderByUser = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId)
  })
}

module.exports = {
  createOrder,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  getOrderByUser
}

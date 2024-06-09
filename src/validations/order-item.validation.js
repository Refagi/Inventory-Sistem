const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrderItem = {
  body: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required(),
    productId: Joi.string().custom(objectId).required(),
    quantity: Joi.number().positive().required(),
    unitPrice: Joi.number().positive().required()
  })
};

const getOrderItemById = {
  params: Joi.object().keys({
    orderItemId: Joi.string().custom(objectId).required()
  })
};

const updateOrderItemById = {
  params: Joi.object().keys({
    orderItemId: Joi.string().custom(objectId).required()
  }),
  body: Joi.object().keys({
    orderId: Joi.string().required(),
    productId: Joi.string().required(),
    quantity: Joi.number().positive().required(),
    unitPrice: Joi.number().positive().required() 
  })
};

const deleteOrderItemsById = {
  params: Joi.object().keys({
    orderItemId: Joi.string().custom(objectId).required()
  })
}

const getOrderItemByOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId).required()
  })
};

module.exports = {
  createOrderItem,
  getOrderItemById,
  updateOrderItemById,
  deleteOrderItemsById,
  getOrderItemByOrder
}
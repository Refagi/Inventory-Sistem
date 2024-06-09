const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().positive().required(),
    quantityInStock: Joi.number().required(),
    categoryId: Joi.string().custom(objectId).required(),
    userId: Joi.string().custom(objectId).required()
  })
};

const getProductById =  {
  parmans: Joi.object().keys({
    productId: Joi.string().custom(objectId)
  })
};

const updateProductById = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId)
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.number().positive(),
    quantityInStock: Joi.number(),
    categoryId: Joi.string().custom(objectId).required(),
    userId: Joi.string().custom(objectId).required()
  }).min(3)
};

const deleteProductById = {
  parmans: Joi.object().keys({
    productId: Joi.string().required()
  })
};

const getProductByUser = {
  parmans: Joi.object().keys({
    userId: Joi.string().required()
  })
}

module.exports = {
  createProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  getProductByUser
}
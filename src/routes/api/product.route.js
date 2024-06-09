const express = require('express');
const { auth } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const productController = require('../../controllers/product.controller');
const { productValidation } = require('../../validations')

const router = express.Router();

router
 .route('/')
 .post(auth(), validate(productValidation.createProduct) , productController.createProduct)
 .get(auth(), productController.getProducts)

router
 .route('/:productId')
 .get(auth(), validate(productValidation.getProductById), productController.getProductById)
 .patch(auth(), validate(productValidation.updateProductById), productController.updateProductById)
 .delete(auth(), validate(productValidation.deleteProductById), productController.deleteProductById)

module.exports = router
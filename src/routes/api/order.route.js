const express = require('express');
const { authAdmin } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { orderValidation } = require('../../validations');
const orderController = require('../../controllers/order.controller');
const { orderItemValidation }= require('../../validations');

const router = express.Router();

router
 .route('/')
 .post(authAdmin(), validate(orderValidation.createOrder), orderController.createOrder)
 .get(authAdmin(), orderController.getOrders)

router
 .route('/:orderId')
 .get(authAdmin(), validate(orderValidation.getOrderById), orderController.getOrderById)
 .put(authAdmin(), validate(orderValidation.updateOrderById), orderController.updateOrderById)
 .delete(authAdmin(), validate(orderValidation.deleteOrderById), orderController.deleteOrderById)

router
 .route('/:orderId/order-items')
 .get(authAdmin(), validate(orderItemValidation.getOrderItemByOrder), orderController.getOrderItemByOrder)

module.exports = router
const express = require('express');
const { authAdmin } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const orderItemController = require('../../controllers/order-item.controller');
const { orderItemValidation } = require('../../validations')

const router = express.Router();

router
 .route('/')
 .post(authAdmin(), validate(orderItemValidation.createOrderItem), orderItemController.createOrderItem)
 .get(authAdmin(), orderItemController.getOrderItems);

router
 .route('/:orderItemId')
 .get(authAdmin(), validate(orderItemValidation.getOrderItemById), orderItemController.getOrderItemById)
 .put(authAdmin(), validate(orderItemValidation.updateOrderItemById), orderItemController.updateOrderItemById)
 .delete(authAdmin(), validate(orderItemValidation.deleteOrderItemsById), orderItemController.deleteOrderItemById)

module.exports = router
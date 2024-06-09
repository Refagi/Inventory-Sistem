const express = require('express');
const { authAdmin } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userController = require('../../controllers/user.controller');
const { userValidation } = require('../../validations');
const { productValidation } = require('../../validations');
const { orderValidation } = require('../../validations')

const router = express.Router();

 router
 .route('/')
 .post(authAdmin(), validate(userValidation.createUser), userController.createUser)
 .get(authAdmin(), userController.getUsers)

 router
 .route('/:userId')
 .get(authAdmin(),  validate(userValidation.getUsersById), userController.getUserById)
 .put(authAdmin(),  validate(userValidation.updateUserById), userController.updateUserById)
 .delete(authAdmin(),  validate(userValidation.deleteUserById), userController.deleteUserById)

 router
 .route('/:userId/products')
 .get(authAdmin(), validate(productValidation.getProductByUser), userController.getProductByUser)

 router
 .route('/:userId/orders')
 .get(authAdmin(), validate(orderValidation.getOrderByUser), userController.getOrderByUser)

 router
 .route('/email/:email')
 .get(authAdmin(), validate(userValidation.getUserByEmail), userController.getUserByEmail)


 module.exports = router;
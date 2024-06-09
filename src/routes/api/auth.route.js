const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.patch('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh', validate(authValidation.refreshTokens), authController.refreshTokens);

module.exports = router;
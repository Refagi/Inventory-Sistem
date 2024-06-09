const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');
const ApiError = require('../utils/ApiError');
const prisma = require('../../prisma/index');

const register = catchAsync(async (req, res) => {
  const existingUser = await userService.getUserByEmail(req.body.email);

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const userCreated = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(userCreated);
  res.status(httpStatus.CREATED).send({ userCreated, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { email: req.body.email },
  });

  if (!user){
    throw new ApiError(httpStatus.NOT_FOUND, 'Email not found');
  } 

  await prisma.token.updateMany({where: {userId: user.id}, data: {blacklisted: true}});

  res.status(httpStatus.OK).send({user})
});

const refreshTokens = catchAsync(async (req, res) => {
  const refresh = await tokenService.refreshTokens(req.body.refreshToken);

  if (!refresh) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }

  res.status(httpStatus.OK).send({ refresh });
})

module.exports = {
  register,
  login,
  logout,
  refreshTokens
};
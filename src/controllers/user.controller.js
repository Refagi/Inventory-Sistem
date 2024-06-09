const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: "Create User Success",
    data: user
  });
})

const getUserByEmail = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.params.email);

  if(!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Get User By Email Success",
    data: user
  });
}) 

const getUsers = catchAsync(async (req, res) => {
  const filter = {role: req.query.role};
  const options = {page: req.query.page, size: req.query.size};

  const result = await userService.getUsers(filter, options);

  if (options.page > result.page || options.size > result.totalData) throw new ApiError(httpStatus.BAD_REQUEST, "Page or Size is not Found");

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Get All User Success",
    currentPage: parseInt(result.page),
    totalData: result.totalData,
    totalPage: result.totalPage,
    data: result.data
  });
})

const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);

  if(!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Get User By id Success",
    data: user
  });
})

const updateUserById = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Update User By id Success",
    data: user
  });
})

const deleteUserById = catchAsync(async (req, res) => {
  const user = await userService.deleteUserById(req.params.userId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Delete User By id Success",
    data: user
  });
});

const getProductByUser = catchAsync (async (req, res) => {
  const product = await userService.getProductByUser(req.params.userId);

  if(!product) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Get Product By User Success",
    data: product
  });
});

const getOrderByUser = catchAsync (async (req, res) => {
  const order = await userService.getOrderByUser(req.params.userId);

  if(!order) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Get Order By User Success",
    data: order
  });
});

module.exports = {
  createUser,
  getUserByEmail,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getProductByUser,
  getOrderByUser
}
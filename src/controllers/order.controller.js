const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');

const createOrder = catchAsync (async (req, res) => {
  const order = await orderService.createOrder(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: "Create Order Success",
    data: order
  });
});

const getOrders = catchAsync (async (req, res) => {
  const filter = {customerName: req.query.customerName};
  const options = {page: req.query.page, size: req.query.size};

  const result = await orderService.getOrders(filter, options);

  if (options.page > result.page || options.size > result.totalData) throw new ApiError(httpStatus.BAD_REQUEST, "Page or Size is not Found");

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Get Orders Success",
    currentPage: parseInt(result.page),
    totalData: result.totalData,
    totalPage: result.totalPage, 
    data: result.data
  });
});

const getOrderById = catchAsync (async (req, res) => {
  const order = await orderService.getOrderById(req.params.orderId);

  if(!order) throw new ApiError(httpStatus.NOT_FOUND, 'Order Not Found');

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Get Order By Id Success",
    data: order
  });
});

const updateOrderById = catchAsync (async (req, res) => {
  const order = await orderService.updateOrderById(req.params.orderId, req.body);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Update Order By Id Success",
    data: order
  });
});

const deleteOrderById = catchAsync (async (req, res) => {
  const order = await orderService.deleteOrderById(req.params.orderId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Delete Order By Id Success",
    data: order
  });
});

const getOrderItemByOrder = catchAsync (async (req, res) => {
  const getOrderItem = await orderService.getOrderItemByOrder(req.params.orderId)

  if(!getOrderItem) throw new ApiError(httpStatus.NOT_FOUND, "Order Not Found")

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Get Order Item By Order Success",
    data: getOrderItem
  });
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  getOrderItemByOrder
}
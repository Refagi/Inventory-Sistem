const httpStatus = require('http-status');
const prisma = require('../../prisma/index');
const ApiError = require('../utils/ApiError');

const createOrder = async (orderBodys) => {
  const createOrder =  await prisma.order.create({
    data: orderBodys
  });

  return createOrder
};

const getOrders = async (filter, options) => {
  const {customerName} = filter;
  const {page = 1, size = 10} = options;
  const countPage = (page - 1) * size; //menghitung skip yang ditampilkan per page

  if(!customerName && !page && !size) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid query Request');

  const result = await prisma.order.findMany({
    skip: parseInt(countPage),
    take: parseInt(size),
    where: {
      customerName: {
        contains: customerName
      }
    },
    orderBy: {customerName: 'asc'}
  });

  const resultOrders = await prisma.order.count(); // total data keseluruhan
  const totalPage = Math.ceil(resultOrders / size);//total page 

  return {totalPage, page, totalData: resultOrders, data: result};
};

const getOrderById = async (orderId) => {
  const getOrder = await prisma.order.findFirst({
    where: {id: orderId}
  });

  return getOrder
};

const updateOrderById = async (orderId, orderBodys) => {
  const order = await getOrderById(orderId);

  if(!order) throw new ApiError(httpStatus.NOT_FOUND, 'order not found');

  const updateOrder = await prisma.order.update({
    where: {id: orderId},
    data: orderBodys
  });

  return updateOrder
};

const deleteOrderById = async (orderId) => {
  const order = await getOrderById(orderId);

  if(!order) throw new ApiError(httpStatus.NOT_FOUND, 'order not found');

  const deleteOrder = await prisma.order.delete({
    where: {id: orderId}
  });

  return deleteOrder
};

const getOrderItemByOrder = async (orderId) => {
  const orderItemByOrder = await getOrderById(orderId)

  if(!orderItemByOrder) throw new ApiError(httpStatus.NOT_FOUND, "Order Item or Orders Not Found")

  const getOrderItem = await prisma.order.findMany({
    where: {id: orderId},
    include: {orderItems: true}
  })

  return getOrderItem
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  getOrderItemByOrder
}
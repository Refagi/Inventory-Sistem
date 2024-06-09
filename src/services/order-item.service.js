const httpStatus = require('http-status');
const prisma = require('../../prisma/index');
const ApiError = require('../utils/ApiError');

const createOrderItem = async (orderItemBodys) => {
  const getOrder = await prisma.order.findUnique({
    where: {id: orderItemBodys.orderId}
  });

  const getProduct = await prisma.product.findUnique({
    where: {id: orderItemBodys.productId}
  });

  if(!getOrder) throw new ApiError(httpStatus.NOT_FOUND, "Order Not Found");

  if(!getProduct) throw new ApiError(httpStatus.NOT_FOUND, "Product Not Found");

  if(orderItemBodys.quantity > getProduct.quantityInStock ) throw new ApiError(httpStatus.BAD_REQUEST, "The quantity of the ordered item exceeds the available stock");

   await prisma.product.update({
    where: {id: orderItemBodys.productId},
    data: {quantityInStock: getProduct.quantityInStock - orderItemBodys.quantity}
  });

  if(orderItemBodys.unitPrice !== getProduct.price) throw new ApiError(httpStatus.BAD_REQUEST, "The unit price of the ordered item does not match the price of the product.");

  let countTotalPrice = orderItemBodys.quantity * orderItemBodys.unitPrice;

  await prisma.order.update({
    where: {id: orderItemBodys.orderId},
    data: {totalPrice: countTotalPrice + getOrder.totalPrice}
  });

  const createOrderItem = await prisma.orderItem.create({
    data: orderItemBodys
  });

  return createOrderItem
};

const getOrderItems = async (filter, options) => {
  const {quantityLarge = Infinity, quantitySmall = 1} = filter;
  const {page = 1, size = 10} = options;
  const countPage = (page - 1) * size; //menghitung skip yang ditampilkan per page

  if(!quantityLarge || !quantitySmall || !page || !size) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid query Request');

  const result = await prisma.orderItem.findMany({
    skip: parseInt(countPage),
    take: parseInt(size),
    where: {
      quantity: {
        gte: parseInt(quantitySmall),
        lte: parseInt(quantityLarge)
      }
    },
  });

  const resultOrderItems = await prisma.orderItem.count(); // total data keseluruhan
  const totalPage = Math.ceil(resultOrderItems / size); //total page 

  return {totalPage, page, totalData: resultOrderItems, data: result};
};

const getOrderItemById = async (orderItemId) => {
  const getOrderItem = await prisma.orderItem.findFirst({
    where: {id: orderItemId}
  })

  return getOrderItem
};

const updateOrderItemById = async (orderItemId, orderItemBodys) => {
  const orderItem = await getOrderItemById(orderItemId)

  if(!orderItem) throw new ApiError(httpStatus.NOT_FOUND, 'order Item not found');

  const getOrder = await prisma.order.findUnique({
    where: {id: orderItemBodys.orderId}
  });

  const getProduct = await prisma.product.findUnique({
    where: {id: orderItemBodys.productId}
  });

  if(!getOrder) throw new ApiError(httpStatus.NOT_FOUND, "Order Not Found");

  if(!getProduct) throw new ApiError(httpStatus.NOT_FOUND, "Product Not Found");

  if(orderItemBodys.quantity > getProduct.quantityInStock ) throw new ApiError(httpStatus.BAD_REQUEST, "The quantity of the ordered item exceeds the available stock");

  await prisma.product.update({
    where: {id: orderItemBodys.productId},
    data: {quantityInStock: getProduct.quantityInStock - orderItemBodys.quantity}
  });

  if(orderItemBodys.unitPrice !== getProduct.price) throw new ApiError(httpStatus.BAD_REQUEST, "The unit price of the ordered item does not match the price of the product.");

  let countTotalPrice = orderItemBodys.quantity * orderItemBodys.unitPrice;

  await prisma.order.update({
    where: {id: orderItemBodys.orderId},
    data: {totalPrice: countTotalPrice + getOrder.totalPrice}
  });

  const updateOrderItem = await prisma.orderItem.update({
    where: {id: orderItemId},
    data: orderItemBodys
  })

  return updateOrderItem
};

const deleteOrderItemById = async (orderItemId) => {
  const orderItem = await getOrderItemById(orderItemId)

  if(!orderItem) throw new ApiError(httpStatus.NOT_FOUND, 'order Item not found');

  const getOrder = await prisma.order.findUnique({
    where: {id: orderItem.orderId}
  });

  const getProduct = await prisma.product.findUnique({
    where: {id: orderItem.productId}
  });

  if(!getOrder) throw new ApiError(httpStatus.NOT_FOUND, "Order Not Found");

  if(!getProduct) throw new ApiError(httpStatus.NOT_FOUND, "Product Not Found");

  await prisma.product.update({
    where: {id: orderItem.productId},
    data: {quantityInStock: orderItem.quantity + getProduct.quantityInStock}
  });

  let countTotalPrice = orderItem.quantity * orderItem.unitPrice;

  await prisma.order.update({
    where: {id: orderItem.orderId},
    data: {totalPrice: getOrder.totalPrice - countTotalPrice}
  });

  const deleteOrderItem = await prisma.orderItem.delete({
    where: {id: orderItemId}
  });

  return deleteOrderItem
}

module.exports = {
  createOrderItem,
  getOrderItems,
  getOrderItemById,
  updateOrderItemById,
  deleteOrderItemById
}
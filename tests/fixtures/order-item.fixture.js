const faker = require('faker');
const prisma = require('../../prisma');
const { v4 } = require('uuid');
const { orderOne } = require('./order.fixture');
const { productOne } = require('./product.fixture');

const orderItemOne = {
  id: v4(),
  orderId: orderOne.id,
  productId: productOne.id,
  quantity: 10,
  unitPrice: 1000,
};

const orderItemTwo = {
  id: v4(),
  orderId: orderOne.id,
  productId: productOne.id,
  quantity: 20,
  unitPrice: 1000,
};

const insertOrderItems = async (orderItems) => {
  try {
    const result = await prisma.orderItem.createMany({
      data: orderItems,
      skipDuplicates: true,
    });

    return result;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { orderItemOne, orderItemTwo, insertOrderItems };
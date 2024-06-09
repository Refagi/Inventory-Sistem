const faker = require('faker');
const prisma = require('../../prisma');
const { v4 } = require('uuid');
const { userOne } = require('./user.fixture');

const orderOne = {
  id: v4(),
  date: '2024-09-11T00:00:00.000Z',
  customerName: `${faker.name.firstName()} ${faker.name.lastName()}`,
  customerEmail: faker.internet.email(),
  userId: userOne.id,
};

const orderTwo = {
  id: v4(),
  date: '2024-09-11T00:00:00.000Z',
  customerName: `${faker.name.firstName()} ${faker.name.lastName()}`,
  customerEmail: faker.internet.email(),
  userId: userOne.id,
};

const insertOrders = async (orders) => {
  try {
    const result = await prisma.order.createMany({
      data: orders,
      skipDuplicates: true,
    });

    return result;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { orderOne, orderTwo, insertOrders };

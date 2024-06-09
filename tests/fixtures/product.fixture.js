const faker = require('faker');
const prisma = require('../../prisma');
const { v4 } = require('uuid');
const { categoryOne, categoryTwo} = require('./category.fixture');
const { userOne, userTwo } = require('./user.fixture');

const productOne = {
  id: v4(),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: 1000,
  quantityInStock: 20,
  categoryId: categoryOne.id,
  userId: userOne.id
};

const productTwo = {
  id: v4(),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: 1000,
  quantityInStock: 20,
  categoryId: categoryOne.id,
  userId: categoryOne.id
}

const insertProducts = async (products) => {
  try {
    const result = await prisma.product.createMany({
      data: products,
      skipDuplicates: true
    });

    return result
  } catch(err){
    console.log(err)
  };
};

module.exports = { productOne, productTwo, insertProducts};
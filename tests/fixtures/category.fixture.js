const faker = require('faker');
const prisma = require('../../prisma');
const { v4 } = require('uuid');

const categoryOne = {
  id: v4(),
  name: faker.commerce.product()
};

const categoryTwo = {
  id: v4(),
  name: faker.commerce.product()
}

const insertCategorys = async (categorys) => {
  try {
    const result = await prisma.category.createMany({
      data: categorys,
      skipDuplicates: true
    });

    return result;
  } catch(err){
    console.log(err);
  };
};

module.exports = { categoryOne, categoryTwo, insertCategorys };
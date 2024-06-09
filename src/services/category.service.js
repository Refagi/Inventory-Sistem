const httpStatus = require('http-status');
const prisma = require('../../prisma/index')
const ApiError = require('../utils/ApiError');
// const { faker } = require('@faker-js/faker');

/**
 * Create a category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryBody) => {
  return prisma.category.create({
    data: categoryBody
  });
};

//untuk memasukan data langsung banyak pake feker.js dan di looping sampai sebnyak yg di inginkan
// const createCategory = async () => {
//   const result = await prisma.category.create({
//     data: {name: faker.commerce.productName()}
//   });

//   return result
// }
// for (let i = 0; i <= 100; i++){
//     createCategory()
// }

/**
 * Query for categorys
 * @returns {Promise<QueryResult>}
 */
const queryCategorys = async (filter, options) => {
  const {name} = filter;
  const {page = 1, size = 10} = options;
  let countPage = (page - 1) * size; //menghitung skip yang ditampilkan per page

  if(!name && !page && !size) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid query Request');

  const categorys = await prisma.category.findMany({
    skip: parseInt(countPage), 
    take: parseInt(size),
    where: {
      name: {
        contains: name
      }
    },
    orderBy: {name: 'asc'}
  });


  const resultCategorys = await prisma.category.count();// total data keseluruhan
  const totalPage = Math.ceil(resultCategorys / size);//total page 

  return { totalPage: totalPage, totalData: resultCategorys, data: categorys, page};
};

/**
 * Get category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
 */
const getCategoryById = async (id) => {
  return prisma.category.findFirst({
    where: {
      id: id
    }
  })
};

/**
 * Update category by id
 * @param {ObjectId} categoryId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */
const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  
  const updateCategory = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: updateBody
  })

  return updateCategory;
};

/**
 * Delete category by id
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  const deleteCategorys = await prisma.category.delete({
    where: {
      id: categoryId
    },
  })

  return deleteCategorys;
};

module.exports = {
  createCategory,
  queryCategorys,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
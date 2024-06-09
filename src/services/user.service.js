const httpStatus = require('http-status');
const prisma = require('../../prisma/index')
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
// const { faker } = require('@faker-js/faker');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  userBody.password = bcrypt.hashSync(userBody.password, 8);

  return prisma.user.create({
    data: userBody
  });
};

//untuk memasukan data langsung banyak pake feker.js dan di looping sampai sebnyak yg di inginkan
// const createUser = async () => {
//   // userBody.password = bcrypt.hashSync(userBody.password, 8);
//   const result = await prisma.user.create({
//     data: {
//       name: faker.internet.userName(),
//       email: faker.internet.email(),
//       password: faker.internet.password(),
//       role: faker.person.jobDescriptor()
//     }
//   })
//   return result
// }
// for (let i = 0; i <= 100; i++){
//   createUser();
// }

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email }
  });
};

const getUsers = async (filter, options) => {
  const {role} = filter;
  const {page = 1, size = 5} = options;
  let countPage = (page - 1) * size; //menghitung skip yang ditampilkan per page

  if(!role && !page && !size) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid query Request');

  const users = await prisma.user.findMany({
    skip: parseInt(countPage),
    take: parseInt(size),
    where: {
      role: {contains: role},
    },
    orderBy: {name: 'asc'}
  })

  const resultUsers = await prisma.user.count();// total data keseluruhan
  const totalPage = Math.ceil(resultUsers / size);//total page 

  return {totalPage, totalData: resultUsers, data: users, page};
};

const getUserById = async (userId) => {
  const getUserById = await prisma.user.findFirst({
    where : { id: userId }
  })

  return getUserById
};

const updateUserById = async (userId, userBody) => {
  const user = await getUserById(userId);

  if(!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const updateUser = await prisma.user.update({
    where : { id: userId },
    data : userBody
  })

  return updateUser
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);

  if(!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const deleteUser = await prisma.user.delete({
    where : { id: userId }
  });

  return deleteUser
};

const getProductByUser = async (userId) => {
  const productUser = await getUserById(userId);

  if (!productUser) throw new ApiError(httpStatus.NOT_FOUND, 'Product or User not found');

  const getProduct = await prisma.user.findMany({
    where: {id: userId},
    include: {products: true}
  })

  return getProduct
};

const getOrderByUser = async (userId) => {
  const orderUser = await getUserById(userId);

  if (!orderUser) throw new ApiError(httpStatus.NOT_FOUND, 'Order or User not found');

  const getOrder = await prisma.user.findMany({
    where: {id: userId},
    include: {orders: true}
  })

  return getOrder
};

module.exports = {
  createUser,
  getUserByEmail,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getProductByUser,
  getOrderByUser
};
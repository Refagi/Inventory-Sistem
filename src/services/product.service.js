const httpStatus = require('http-status');
const prisma = require('../../prisma/index');
const ApiError = require('../utils/ApiError');

const createProduct = async (productBodys) => {
  const createProduct = await prisma.product.create({
    data: productBodys
  });

  return createProduct
};

const getProducts = async (filter, options) => {
  const {priceExpensive = 1000000000, priceCheap = 10, categoryName} = filter;
  const {page = 1, size = 10} = options;
  const countPage = ( page - 1 ) * size;//menghitung skip yang ditampilkan per page

  if(!categoryName && !page && !size) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid query Request');

  const result = await prisma.product.findMany({
    skip: parseInt(countPage),
    take: parseInt(size),
    where: {
      AND: [
        {
          name: {
            contains: categoryName,
          },
        },
        {
          price: {
            gte: parseInt(priceCheap),
            lte: parseInt(priceExpensive),
          },
        },
      ],
    },
    include: {
      category: true
    }
  });

  const resultProduct = await prisma.product.count();// total data keseluruhan
  const totalPage = Math.ceil(resultProduct / size);//total page 

  return {totalPage, totalData: resultProduct, data: result, page};
};

const getProductById = async (id) => {
  const getProduct = await prisma.product.findFirst({
    where: { id: id },
  });

  return getProduct
};

const updateProductById = async (productId, productBodys) => {
  const product = await getProductById(productId);

  if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');

  const updateProduct = await prisma.product.update({
    where: { id: productId },
    data: productBodys,
  });

  return updateProduct
};

const deleteProductById = async (productId) => {
  const product = await getProductById(productId);

  if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');

  const deleteProduct = await prisma.product.delete({
    where: { id: productId },
  });

  return deleteProduct
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById
};

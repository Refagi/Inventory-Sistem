const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');

const createProduct = catchAsync (async (req, res) => {
  const product = await productService.createProduct(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: "Create Product Success",
    data: product
  });
});

const getProducts = catchAsync (async (req, res) => {
  const filter = {priceExpensive: req.query.priceExpensive, priceCheap: req.query.priceCheap, categoryName: req.query.categoryName};
  const options = {page: req.query.page, size: req.query.size};

  const result = await productService.getProducts(filter, options);

  if (options.page > result.page || options.size > result.totalData) throw new ApiError(httpStatus.BAD_REQUEST, "Page or Size is not Found");

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Get Products Success",
    currentPage: parseInt(result.page),
    totalData: result.totalData,
    totalPage: result.totalPage, 
    data: result.data 
  });
})

const getProductById = catchAsync (async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  if(!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product Not Found');

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Get Product By Id Success",
    data: product
  });
});

const updateProductById = catchAsync (async (req, res) => {
  const product = await productService.updateProductById(req.params.productId, req.body);
  
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Update Product By Id Success",
    data: product
  });
});

const deleteProductById = catchAsync (async (req, res) => {
  const product = await productService.deleteProductById(req.params.productId);

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Delete Products Success",
    data: product
  });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
}
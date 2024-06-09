const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { categoryService } = require('../services');

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: "Create Category Success",
    data: category
  });
});

const getCategorys = catchAsync(async (req, res) => {
  const filter = {name: req.query.name};
  const options = { page: req.query.page, size: req.query.size };

  const result = await categoryService.queryCategorys(filter, options);

  if (options.page > result.page || options.size > result.totalData) throw new ApiError(httpStatus.BAD_REQUEST, "Page or Size is invalid");

  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Get Categories Success",
    currentPage: parseInt(result.page),
    totalData: result.totalData,
    totalPage: result.totalPage,
    data: result.data
  });
});

const getCategory = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Get Category By Id Success",
    data: category
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategoryById(req.params.categoryId, req.body);
  
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Update Category Success",
    data: category
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const category = await categoryService.deleteCategoryById(req.params.categoryId);
  
  res.status(httpStatus.OK).send({
    status: httpStatus.OK,
    message: "Delete Category Success",
    data: category
  });
});

module.exports = {
  createCategory,
  getCategorys,
  getCategory,
  updateCategory,
  deleteCategory,
};
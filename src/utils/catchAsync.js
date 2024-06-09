/* eslint-disable prettier/prettier */
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
  
  module.exports = catchAsync;
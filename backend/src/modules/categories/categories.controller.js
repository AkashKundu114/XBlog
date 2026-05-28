const { categoriesService } = require('./categories.service');
const { ApiResponse } = require('../../shared/utils/ApiResponse');
const { catchAsync } = require('../../shared/utils/catchAsync');

const getCategories = catchAsync(async (_req, res) => {
  ApiResponse.success(res, await categoriesService.getAll());
});

const getCategoryBySlug = catchAsync(async (req, res) => {
  ApiResponse.success(res, await categoriesService.getBySlug(req.params.slug));
});

const createCategory = catchAsync(async (req, res) => {
  ApiResponse.created(res, await categoriesService.create(req.body));
});

const updateCategory = catchAsync(async (req, res) => {
  ApiResponse.success(res, await categoriesService.update(req.params.id, req.body), 'Category updated');
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoriesService.delete(req.params.id);
  ApiResponse.noContent(res);
});

module.exports = { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };

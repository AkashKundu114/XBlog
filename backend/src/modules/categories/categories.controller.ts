import { Request, Response } from 'express';
import { categoriesService } from './categories.service';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { catchAsync } from '../../shared/utils/catchAsync';

export const getCategories = catchAsync(async (_req: Request, res: Response) => {
  const categories = await categoriesService.getAll();
  ApiResponse.success(res, categories);
});

export const getCategoryBySlug = catchAsync(async (req: Request, res: Response) => {
  const category = await categoriesService.getBySlug(req.params.slug);
  ApiResponse.success(res, category);
});

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoriesService.create(req.body);
  ApiResponse.created(res, category);
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoriesService.update(req.params.id, req.body);
  ApiResponse.success(res, category, 'Category updated');
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await categoriesService.delete(req.params.id);
  ApiResponse.noContent(res);
});

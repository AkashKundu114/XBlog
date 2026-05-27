import { Request, Response } from 'express';
import { tagsService } from './tags.service';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { catchAsync } from '../../shared/utils/catchAsync';

export const getTags = catchAsync(async (_req: Request, res: Response) => {
  ApiResponse.success(res, await tagsService.getAll());
});

export const createTag = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.created(res, await tagsService.create(req.body.name));
});

export const updateTag = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, await tagsService.update(req.params.id, req.body.name));
});

export const deleteTag = catchAsync(async (req: Request, res: Response) => {
  await tagsService.delete(req.params.id);
  ApiResponse.noContent(res);
});

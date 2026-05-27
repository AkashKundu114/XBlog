import { Request, Response } from 'express';
import { mediaService } from './media.service';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { catchAsync } from '../../shared/utils/catchAsync';
import { ApiError } from '../../shared/utils/ApiError';

export const uploadImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest('No file provided');
  const result = await mediaService.uploadImage(req.file.buffer, 'blog');
  ApiResponse.created(res, result, 'Image uploaded');
});

export const deleteImage = catchAsync(async (req: Request, res: Response) => {
  const { publicId } = req.body;
  if (!publicId) throw ApiError.badRequest('publicId is required');
  await mediaService.deleteImage(publicId);
  ApiResponse.noContent(res);
});

export const getSignedParams = catchAsync(async (_req: Request, res: Response) => {
  const params = mediaService.getSignedUploadParams();
  ApiResponse.success(res, params);
});

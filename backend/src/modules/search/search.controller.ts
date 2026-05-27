import { Request, Response } from 'express';
import { searchService } from './search.service';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { catchAsync } from '../../shared/utils/catchAsync';

export const search = catchAsync(async (req: Request, res: Response) => {
  const { q, page, limit } = req.query as Record<string, string>;
  if (!q?.trim()) return ApiResponse.success(res, [], 'No query');
  const result = await searchService.search(q, page, limit);
  ApiResponse.success(res, result.posts, 'Search results', 200, result.meta);
});

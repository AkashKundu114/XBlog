import { Request, Response } from 'express';
import { analyticsService } from './analytics.service';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { catchAsync } from '../../shared/utils/catchAsync';

export const getOverview = catchAsync(async (_req: Request, res: Response) => {
  ApiResponse.success(res, await analyticsService.getOverview());
});

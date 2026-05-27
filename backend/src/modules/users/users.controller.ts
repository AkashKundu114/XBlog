import { Request, Response } from 'express';
import { usersService } from './users.service';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { catchAsync } from '../../shared/utils/catchAsync';

export const getMe = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, await usersService.getMe(req.user!.id));
});

export const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
  ApiResponse.success(res, await usersService.getAll());
});

export const updateMe = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, await usersService.updateMe(req.user!.id, req.body), 'Profile updated');
});

import { Request, Response } from 'express';
import { authService } from './auth.service';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { catchAsync } from '../../shared/utils/catchAsync';

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  ApiResponse.success(res, result, 'Login successful');
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refresh(refreshToken);
  ApiResponse.success(res, tokens, 'Token refreshed');
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (refreshToken) await authService.logout(refreshToken);
  ApiResponse.success(res, null, 'Logged out successfully');
});

export const me = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, req.user, 'User info');
});

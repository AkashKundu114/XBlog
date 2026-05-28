const { authService } = require('./auth.service');
const { ApiResponse } = require('../../shared/utils/ApiResponse');
const { catchAsync } = require('../../shared/utils/catchAsync');

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  ApiResponse.success(res, result, 'Login successful');
});

const refresh = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refresh(refreshToken);
  ApiResponse.success(res, tokens, 'Token refreshed');
});

const logout = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) await authService.logout(refreshToken);
  ApiResponse.success(res, null, 'Logged out successfully');
});

const me = catchAsync(async (req, res) => {
  ApiResponse.success(res, req.user, 'User info');
});

module.exports = { login, refresh, logout, me };

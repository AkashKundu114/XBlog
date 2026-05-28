const { usersService } = require('./users.service');
const { ApiResponse } = require('../../shared/utils/ApiResponse');
const { catchAsync } = require('../../shared/utils/catchAsync');

const getMe = catchAsync(async (req, res) => { ApiResponse.success(res, await usersService.getMe(req.user.id)); });
const getAllUsers = catchAsync(async (_req, res) => { ApiResponse.success(res, await usersService.getAll()); });
const updateMe = catchAsync(async (req, res) => { ApiResponse.success(res, await usersService.updateMe(req.user.id, req.body), 'Profile updated'); });

module.exports = { getMe, getAllUsers, updateMe };

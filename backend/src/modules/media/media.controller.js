const { mediaService } = require('./media.service');
const { ApiResponse } = require('../../shared/utils/ApiResponse');
const { catchAsync } = require('../../shared/utils/catchAsync');
const { ApiError } = require('../../shared/utils/ApiError');

const uploadImage = catchAsync(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file provided');
  const result = await mediaService.uploadImage(req.file.buffer, 'blog');
  ApiResponse.created(res, result, 'Image uploaded');
});

const deleteImage = catchAsync(async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) throw ApiError.badRequest('publicId is required');
  await mediaService.deleteImage(publicId);
  ApiResponse.noContent(res);
});

const getSignedParams = catchAsync(async (_req, res) => {
  ApiResponse.success(res, mediaService.getSignedUploadParams());
});

module.exports = { uploadImage, deleteImage, getSignedParams };

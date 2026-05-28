const { tagsService } = require('./tags.service');
const { ApiResponse } = require('../../shared/utils/ApiResponse');
const { catchAsync } = require('../../shared/utils/catchAsync');

const getTags = catchAsync(async (_req, res) => { ApiResponse.success(res, await tagsService.getAll()); });
const createTag = catchAsync(async (req, res) => { ApiResponse.created(res, await tagsService.create(req.body.name)); });
const updateTag = catchAsync(async (req, res) => { ApiResponse.success(res, await tagsService.update(req.params.id, req.body.name)); });
const deleteTag = catchAsync(async (req, res) => { await tagsService.delete(req.params.id); ApiResponse.noContent(res); });

module.exports = { getTags, createTag, updateTag, deleteTag };

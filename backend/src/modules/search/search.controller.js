const { searchService } = require('./search.service');
const { ApiResponse } = require('../../shared/utils/ApiResponse');
const { catchAsync } = require('../../shared/utils/catchAsync');

const search = catchAsync(async (req, res) => {
  const { q, page, limit } = req.query;
  if (!q?.trim()) return ApiResponse.success(res, [], 'No query');
  const result = await searchService.search(q, page, limit);
  ApiResponse.success(res, result.posts, 'Search results', 200, result.meta);
});
module.exports = { search };

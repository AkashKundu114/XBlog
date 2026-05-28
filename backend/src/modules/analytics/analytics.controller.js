const { analyticsService } = require('./analytics.service');
const { ApiResponse } = require('../../shared/utils/ApiResponse');
const { catchAsync } = require('../../shared/utils/catchAsync');

const getOverview = catchAsync(async (_req, res) => {
  ApiResponse.success(res, await analyticsService.getOverview());
});
module.exports = { getOverview };

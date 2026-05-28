const { postsService } = require('./posts.service');
const { ApiResponse } = require('../../shared/utils/ApiResponse');
const { catchAsync } = require('../../shared/utils/catchAsync');

const getPosts = catchAsync(async (req, res) => {
  const result = await postsService.getPosts(req.query);
  ApiResponse.success(res, result.posts, 'Posts fetched', 200, result.meta);
});

const getPostBySlug = catchAsync(async (req, res) => {
  const post = await postsService.getPostBySlug(req.params.slug);
  ApiResponse.success(res, post);
});

const getPostById = catchAsync(async (req, res) => {
  const post = await postsService.getPostById(req.params.id);
  ApiResponse.success(res, post);
});

const createPost = catchAsync(async (req, res) => {
  const post = await postsService.createPost(req.body, req.user.id);
  ApiResponse.created(res, post);
});

const updatePost = catchAsync(async (req, res) => {
  const post = await postsService.updatePost(req.params.id, req.body);
  ApiResponse.success(res, post, 'Post updated');
});

const deletePost = catchAsync(async (req, res) => {
  await postsService.deletePost(req.params.id);
  ApiResponse.noContent(res);
});

const trackView = catchAsync(async (req, res) => {
  const visitorId = req.headers['x-visitor-id'] || req.ip || 'anonymous';
  postsService.trackView(req.params.id, visitorId);
  ApiResponse.success(res, null, 'View tracked');
});

module.exports = { getPosts, getPostBySlug, getPostById, createPost, updatePost, deletePost, trackView };

import { Request, Response } from 'express';
import { postsService } from './posts.service';
import { ApiResponse } from '../../shared/utils/ApiResponse';
import { catchAsync } from '../../shared/utils/catchAsync';

export const getPosts = catchAsync(async (req: Request, res: Response) => {
  const result = await postsService.getPosts(req.query);
  ApiResponse.success(res, result.posts, 'Posts fetched', 200, result.meta);
});

export const getPostBySlug = catchAsync(async (req: Request, res: Response) => {
  const post = await postsService.getPostBySlug(req.params.slug);
  ApiResponse.success(res, post);
});

export const getPostById = catchAsync(async (req: Request, res: Response) => {
  const post = await postsService.getPostById(req.params.id);
  ApiResponse.success(res, post);
});

export const createPost = catchAsync(async (req: Request, res: Response) => {
  const post = await postsService.createPost(req.body, req.user!.id);
  ApiResponse.created(res, post);
});

export const updatePost = catchAsync(async (req: Request, res: Response) => {
  const post = await postsService.updatePost(req.params.id, req.body);
  ApiResponse.success(res, post, 'Post updated');
});

export const deletePost = catchAsync(async (req: Request, res: Response) => {
  await postsService.deletePost(req.params.id);
  ApiResponse.noContent(res);
});

export const trackView = catchAsync(async (req: Request, res: Response) => {
  const visitorId = req.headers['x-visitor-id'] as string || req.ip || 'anonymous';
  postsService.trackView(req.params.id, visitorId);
  ApiResponse.success(res, null, 'View tracked');
});

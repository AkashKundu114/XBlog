import { usersRepository } from './users.repository';
import { ApiError } from '../../shared/utils/ApiError';

export class UsersService {
  async getMe(id: string) {
    const user = await usersRepository.findById(id);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }

  async getAll() {
    return usersRepository.findAll();
  }

  async updateMe(id: string, data: { name?: string; bio?: string; avatar?: string }) {
    const user = await usersRepository.findById(id);
    if (!user) throw ApiError.notFound('User not found');
    return usersRepository.update(id, data);
  }
}
export const usersService = new UsersService();

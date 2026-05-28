const { usersRepository } = require('./users.repository');
const { ApiError } = require('../../shared/utils/ApiError');

class UsersService {
  async getMe(id) {
    const user = await usersRepository.findById(id);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }
  getAll() { return usersRepository.findAll(); }
  async updateMe(id, data) {
    const user = await usersRepository.findById(id);
    if (!user) throw ApiError.notFound('User not found');
    return usersRepository.update(id, data);
  }
}
const usersService = new UsersService();
module.exports = { usersService };

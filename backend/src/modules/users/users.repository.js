const { prisma } = require('../../database/client');

class UsersRepository {
  findById(id) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, avatar: true, bio: true, role: true, createdAt: true },
    });
  }
  findAll() {
    return prisma.user.findMany({
      select: { id: true, email: true, name: true, avatar: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  update(id, data) {
    return prisma.user.update({
      where: { id }, data,
      select: { id: true, email: true, name: true, avatar: true, bio: true, role: true },
    });
  }
}
const usersRepository = new UsersRepository();
module.exports = { usersRepository };

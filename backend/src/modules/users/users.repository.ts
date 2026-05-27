import { prisma } from '../../database/client';

export class UsersRepository {
  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, avatar: true, bio: true, role: true, createdAt: true },
    });
  }

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  findAll() {
    return prisma.user.findMany({
      select: { id: true, email: true, name: true, avatar: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  update(id: string, data: { name?: string; bio?: string; avatar?: string }) {
    return prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, avatar: true, bio: true, role: true },
    });
  }
}
export const usersRepository = new UsersRepository();

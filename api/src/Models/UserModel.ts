import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userModel = {
  async createUser(name: string, email: string, password: string) {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password
      }
    });

    return user;
  },

  async findUserByEmailAndPassword(email: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
        password
      }
    });

    return user;
  },

  async findUsers() {
    const users = await prisma.user.findMany();
    return users;
  }
};

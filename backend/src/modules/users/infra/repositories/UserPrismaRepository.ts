import { Prisma, PrismaClient, User } from "@prisma/client";
import { IUserRepository } from "../../repositories/IUserRepository";
import { prismaClient } from "../../../../../prisma/geConnection";

export class PrismaUserRepository implements IUserRepository {

  private prisma: PrismaClient = prismaClient;

  async create(data: Prisma.UserUncheckedCreateInput): Promise<User> {

    const user = await this.prisma.user.create({data})
    return user;
  }
  async list(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;  
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({where: {email}});
    return user;
  }
  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({where: {id}});
    return user;
  }
  async findByInviteId(id: number): Promise<User | null> {
    const user = await this.prisma.user.findFirst({where: {inviteId: id}});
    return user;
  }
  async deleteById(id: string): Promise<void> {
    await this.prisma.user.delete({where: {id}});
  }
  async restoreById(id: string): Promise<void> {
    await this.prisma.user.update({where: {id}, data: {deletedAt: null}});
  }
  async userCount(): Promise<number> {
    const count = await this.prisma.user.count();
    return count;
  }
  async listUserFriends(userId: string): Promise<User[]> {
    const user = await this.prisma.user.findUnique({where: {id: userId}, include: {friends: true}});
    if (!user) {
      throw new Error('User not found');
    }
    return user.friends;
  }

  async addFriend(userId: string, friendInviteId: number): Promise<Boolean> {
    const user = await this.prisma.user.findUnique({where: {id: userId}});
    const friend = await this.prisma.user.findFirst({where: {inviteId: friendInviteId}});
    if (!user || !friend) {
      return false;
    }

    if (user.id === friend.id) {
      return false;
    }

    const alreadyFriend = await this.prisma.user.findFirst({
      where: {
        id: userId,
        friends: {
          some: {
            id: friend.id
          }
        }
      }
    });

    if (alreadyFriend) {
      return false;
    }

    await this.prisma.user.update({
      where: {id: userId},
      data: {
        friends: {
          connect: {
            id: friend.id
          }
        }
      }
    });

    await this.prisma.user.update({
      where: {id: friend.id},
      data: {
        friends: {
          connect: {
            id: userId
          }
        }
      }
    });

    return true;
  }

  async countFriends(user: User): Promise<number> {
    const count = await this.prisma.user.count({
      where: {
        friends: {
          some: {
            id: user.id
          }
        }
      }
    });
    return count;
  }
}
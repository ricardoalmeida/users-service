import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({ log: ["query"] });

export interface Context {
  prisma: PrismaClient;
  userId: string;
}

export const createContext = ({ req: request }: { req: any }): Context => {
  const userId = request?.headers["user-id"];

  return { prisma, userId };
};

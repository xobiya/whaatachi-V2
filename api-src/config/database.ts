import prisma from '../lib/prisma';

export async function connectDB() {
  await prisma.$connect();
  return prisma;
}

export default prisma;

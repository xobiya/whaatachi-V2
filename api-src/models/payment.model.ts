import prisma from '../lib/prisma';

export async function createPayment(data: Record<string, any>) {
  return prisma.payment.create({
    data: {
      id: data.id,
      userId: data.userId,
      profileId: data.profileId,
      profileName: data.profileName,
      profileImage: data.profileImage ?? null,
      senderName: data.senderName,
      senderPhone: data.senderPhone,
      transactionId: data.transactionId.toUpperCase(),
      method: data.method,
      amount: data.amount,
      receiptImage: data.receiptImage ?? null,
      status: 'Pending',
    },
  });
}

export async function findPaymentById(id: string) {
  return prisma.payment.findUnique({ where: { id } });
}

export async function findPaymentsByUser(userId: string) {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findAllPayments() {
  return prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function updatePaymentStatus(id: string, status: 'Approved' | 'Rejected') {
  return prisma.payment.update({
    where: { id },
    data: { status },
  });
}

export async function hasApprovedPayment(userId: string) {
  const count = await prisma.payment.count({
    where: { userId, status: 'Approved' },
  });
  return count > 0;
}

export async function countPaymentsByStatus(status: string) {
  return prisma.payment.count({ where: { status } });
}

export async function sumApprovedRevenue() {
  const result = await prisma.payment.aggregate({
    where: { status: 'Approved' },
    _sum: { amount: true },
  });
  return result._sum.amount ?? 0;
}

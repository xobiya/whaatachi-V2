import { query, getRow, scalar } from '../lib/db';

export async function createPayment(data: Record<string, any>) {
  await query(
    `INSERT INTO Payment (id, userId, profileId, profileName, profileImage, senderName, senderPhone, transactionId, method, amount, receiptImage, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
    [
      data.id, data.userId, data.profileId, data.profileName,
      data.profileImage ?? null, data.senderName, data.senderPhone,
      data.transactionId.toUpperCase(), data.method, data.amount,
      data.receiptImage ?? null,
    ]
  );
  return findPaymentById(data.id);
}

export async function findPaymentById(id: string) {
  return getRow<any>('SELECT * FROM Payment WHERE id = ?', [id]);
}

export async function findPaymentsByUser(userId: string) {
  return query<any[]>('SELECT * FROM Payment WHERE userId = ? ORDER BY createdAt DESC', [userId]);
}

export async function findAllPayments() {
  return query<any[]>('SELECT * FROM Payment ORDER BY createdAt DESC');
}

export async function updatePaymentStatus(id: string, status: 'Approved' | 'Rejected') {
  await query('UPDATE Payment SET status = ? WHERE id = ?', [status, id]);
  return findPaymentById(id);
}

export async function hasApprovedPayment(userId: string) {
  const count = await scalar<number>(
    'SELECT COUNT(*) as cnt FROM Payment WHERE userId = ? AND status = ?',
    [userId, 'Approved']
  );
  return count > 0;
}

export async function countPaymentsByStatus(status: string) {
  return scalar<number>('SELECT COUNT(*) as cnt FROM Payment WHERE status = ?', [status]);
}

export async function sumApprovedRevenue() {
  const result = await scalar<number | null>(
    'SELECT SUM(amount) as total FROM Payment WHERE status = ?',
    ['Approved']
  );
  return result ?? 0;
}

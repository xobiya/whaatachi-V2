import { query } from '../config/database';
import { PaymentRow } from '../types';

export async function createPayment(data: {
  id: string;
  userId: string;
  profileId: string;
  profileName: string;
  profileImage?: string;
  senderName: string;
  senderPhone: string;
  transactionId: string;
  method: string;
  amount: number;
  receiptImage?: string;
}): Promise<void> {
  await query(
    `INSERT INTO payments (id, userId, profileId, profileName, profileImage, senderName, senderPhone, transactionId, method, amount, receiptImage, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
    [data.id, data.userId, data.profileId, data.profileName, data.profileImage ?? null,
     data.senderName, data.senderPhone, data.transactionId.toUpperCase(), data.method, data.amount,
     data.receiptImage ?? null]
  );
}

export async function findPaymentById(id: string): Promise<PaymentRow | null> {
  const rows: any = await query('SELECT * FROM payments WHERE id = ?', [id]);
  return rows.length ? (rows[0] as PaymentRow) : null;
}

export async function findPaymentsByUser(userId: string): Promise<PaymentRow[]> {
  const rows: any = await query('SELECT * FROM payments WHERE userId = ? ORDER BY createdAt DESC', [userId]);
  return rows as PaymentRow[];
}

export async function findAllPayments(): Promise<PaymentRow[]> {
  const rows: any = await query('SELECT * FROM payments ORDER BY createdAt DESC');
  return rows as PaymentRow[];
}

export async function updatePaymentStatus(id: string, status: 'Approved' | 'Rejected'): Promise<void> {
  await query('UPDATE payments SET status = ? WHERE id = ?', [status, id]);
}

export async function hasApprovedPayment(userId: string): Promise<boolean> {
  const rows: any = await query(
    "SELECT COUNT(*) as count FROM payments WHERE userId = ? AND status = 'Approved'",
    [userId]
  );
  return rows[0].count > 0;
}

export async function countPaymentsByStatus(status: string): Promise<number> {
  const rows: any = await query('SELECT COUNT(*) as count FROM payments WHERE status = ?', [status]);
  return rows[0].count;
}

export async function sumApprovedRevenue(): Promise<number> {
  const rows: any = await query("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'Approved'");
  return rows[0].total;
}

import mongoose, { Schema } from 'mongoose';

const paymentSchema = new Schema({
  _id: { type: String },
  userId: { type: String, ref: 'User', required: true },
  profileId: { type: String, required: true },
  profileName: { type: String, required: true },
  profileImage: String,
  senderName: { type: String, required: true },
  senderPhone: { type: String, required: true },
  transactionId: { type: String, required: true },
  method: { type: String, enum: ['Telebirr', 'CBE Birr'], required: true },
  amount: { type: Number, required: true },
  receiptImage: String,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
}, { timestamps: true, _id: false });

const Payment = mongoose.model('Payment', paymentSchema) as any;

export async function createPayment(data: Record<string, any>): Promise<any> {
  return Payment.create({
    _id: data.id,
    userId: data.userId,
    profileId: data.profileId,
    profileName: data.profileName,
    profileImage: data.profileImage,
    senderName: data.senderName,
    senderPhone: data.senderPhone,
    transactionId: data.transactionId.toUpperCase(),
    method: data.method,
    amount: data.amount,
    receiptImage: data.receiptImage,
    status: 'Pending',
  });
}

export async function findPaymentById(id: string): Promise<any> {
  return Payment.findById(id).lean();
}

export async function findPaymentsByUser(userId: string): Promise<any[]> {
  return Payment.find({ userId }).sort({ createdAt: -1 }).lean();
}

export async function findAllPayments(): Promise<any[]> {
  return Payment.find().sort({ createdAt: -1 }).lean();
}

export async function updatePaymentStatus(id: string, status: 'Approved' | 'Rejected'): Promise<void> {
  await Payment.findByIdAndUpdate(id, { $set: { status } });
}

export async function hasApprovedPayment(userId: string): Promise<boolean> {
  const count = await Payment.countDocuments({ userId, status: 'Approved' });
  return count > 0;
}

export async function countPaymentsByStatus(status: string): Promise<number> {
  return Payment.countDocuments({ status });
}

export async function sumApprovedRevenue(): Promise<number> {
  const result = await Payment.aggregate([
    { $match: { status: 'Approved' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  return result.length > 0 ? result[0].total : 0;
}

export default Payment;

import { Router, Response } from 'express';
import { v4 as uuid } from 'uuid';
import * as paymentModel from '../models/payment.model';
import * as userModel from '../models/user.model';
import { authenticate, adminOnly, AuthRequest } from '../middleware/auth';
import { validatePayment } from '../middleware/validate';
import { paymentRowToPayment } from '../utils/transform';

const router = Router();

router.post('/', authenticate, validatePayment, async (req: AuthRequest, res: Response) => {
  try {
    const { profileId, profileName, profileImage, senderName, senderPhone, transactionId, method, amount, receiptImage } = req.body;

    const id = uuid();
    const created = await paymentModel.createPayment({
      id,
      userId: req.userId!,
      profileId,
      profileName,
      profileImage,
      senderName,
      senderPhone,
      transactionId,
      method,
      amount: amount || 200,
      receiptImage,
    });

    if (!created) {
      res.status(500).json({ error: 'Failed to create payment' });
      return;
    }
    const plain = typeof created.toObject === 'function' ? created.toObject() : created;
    res.status(201).json({ payment: paymentRowToPayment(plain) });
  } catch (err: any) {
    console.error('Submit payment error:', err);
    res.status(500).json({ error: 'Failed to submit payment' });
  }
});

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const rows = req.isAdmin
      ? await paymentModel.findAllPayments()
      : await paymentModel.findPaymentsByUser(req.userId!);
    const payments = rows.map((r: any) => paymentRowToPayment(r));
    res.json({ payments });
  } catch (err: any) {
    console.error('Get payments error:', err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

router.put('/:id/approve', authenticate, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const payment = await paymentModel.updatePaymentStatus(id, 'Approved');

    if (!payment) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }

    await userModel.verifyUser(payment.userId);

    res.json({ payment: paymentRowToPayment(payment as any) });
  } catch (err: any) {
    console.error('Approve payment error:', err);
    res.status(500).json({ error: 'Failed to approve payment' });
  }
});

router.put('/:id/reject', authenticate, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const payment = await paymentModel.updatePaymentStatus(id, 'Rejected');

    if (!payment) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }

    res.json({ payment: paymentRowToPayment(payment as any) });
  } catch (err: any) {
    console.error('Reject payment error:', err);
    res.status(500).json({ error: 'Failed to reject payment' });
  }
});

router.get('/check', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const hasPaid = await paymentModel.hasApprovedPayment(req.userId!);
    res.json({ hasPaid });
  } catch (err: any) {
    console.error('Check payment error:', err);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

export default router;

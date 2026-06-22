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

    const host = req.get('host');
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    res.status(201).json({ payment: paymentRowToPayment(created, baseUrl) });
  } catch (err: any) {
    console.error('Submit payment error:', err);
    res.status(500).json({ error: 'Failed to submit payment' });
  }
});

router.get('/:id/receipt', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const payment = await paymentModel.findPaymentById(String(req.params.id));
    if (!payment || !payment.receiptImage) {
      res.status(404).send('Not found');
      return;
    }

    // Only the user who paid or an admin can view the receipt
    if (payment.userId !== req.userId && !req.isAdmin) {
      res.status(403).send('Not authorized');
      return;
    }

    const imgStr = payment.receiptImage;
    const match = imgStr.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      const contentType = match[1];
      const data = Buffer.from(match[2], 'base64');
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(data);
    } else {
      const data = Buffer.from(imgStr, 'base64');
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(data);
    }
  } catch (err) {
    console.error('Receipt fetch error:', err);
    res.status(500).send('Error');
  }
});

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const rows = req.isAdmin
      ? await paymentModel.findAllPayments()
      : await paymentModel.findPaymentsByUser(req.userId!);

    const host = req.get('host');
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    const payments = rows.map((r: any) => paymentRowToPayment(r, baseUrl));
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

    const host = req.get('host');
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    res.json({ payment: paymentRowToPayment(payment as any, baseUrl) });
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

    const host = req.get('host');
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    res.json({ payment: paymentRowToPayment(payment as any, baseUrl) });
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

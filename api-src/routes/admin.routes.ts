import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import * as adminModel from '../models/admin.model';
import * as userModel from '../models/user.model';
import * as paymentModel from '../models/payment.model';
import * as storyModel from '../models/story.model';
import { authenticate, adminOnly, generateToken, AuthRequest } from '../middleware/auth';
import { validateAdminLogin, validatePasscodeUpdate } from '../middleware/validate';
import { AdminStats } from '../types';

const router = Router();

const ENV_PASSCODE = process.env.ADMIN_PASSCODE || 'admin123';

router.post('/login', validateAdminLogin, async (req: AuthRequest, res: Response) => {
  try {
    const { passcode } = req.body;

    const admin = await adminModel.findOrCreateAdmin(ENV_PASSCODE);
    const match = await bcrypt.compare(passcode, admin.password);

    if (!match) {
      res.status(401).json({ error: 'Invalid passcode' });
      return;
    }

    const token = generateToken({ id: String(admin.id), isAdmin: true }, '1h');
    res.json({ token });
  } catch (err: any) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Admin login failed' });
  }
});

router.put('/passcode', authenticate, adminOnly, validatePasscodeUpdate, async (req: AuthRequest, res: Response) => {
  try {
    const { newPasscode } = req.body;
    await adminModel.updateAdminPasscode(newPasscode);
    res.json({ success: true });
  } catch (err: any) {
    console.error('Update passcode error:', err);
    res.status(500).json({ error: 'Failed to update passcode' });
  }
});

router.get('/stats', authenticate, adminOnly, async (_req: AuthRequest, res: Response) => {
  try {
    const stats: AdminStats = {
      totalUsers: await userModel.countUsers(),
      maleUsers: await userModel.countUsersByGender('Male'),
      femaleUsers: await userModel.countUsersByGender('Female'),
      verifiedUsers: await userModel.countVerifiedUsers(),
      pendingPayments: await paymentModel.countPaymentsByStatus('Pending'),
      approvedPayments: await paymentModel.countPaymentsByStatus('Approved'),
      revenue: await paymentModel.sumApprovedRevenue(),
      totalStories: await storyModel.countStories(),
    };

    res.json({ stats });
  } catch (err: any) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.put('/profiles/:id/verify', authenticate, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const result = await userModel.toggleUserVerification(id);
    if (!result) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ verified: result.verified });
  } catch (err: any) {
    console.error('Toggle verification error:', err);
    res.status(500).json({ error: 'Failed to toggle verification' });
  }
});

export default router;

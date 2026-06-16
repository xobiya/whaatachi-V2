import { Router, Response } from 'express';
import * as userModel from '../models/user.model';
import { authenticate, AuthRequest } from '../middleware/auth';
import { userRowToProfile } from '../utils/transform';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    res.json(await userModel.getAllProfiles());
  } catch (err: any) {
    console.error('[profiles] error:', err?.message || err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to fetch profiles' });
    }
  }
});

router.get('/test', (_req, res) => {
  res.json({ ok: true, time: Date.now() });
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const user = await userModel.findUserById(String(req.params.id));
    if (!user) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    res.json({ profile: userRowToProfile(user as any) });
  } catch (err: any) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userId !== String(req.params.id) && !req.isAdmin) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    const { name, age, city, address, bio, lookingFor, image, status, relationshipIntent, interests, phone, telegram, instagram, email } = req.body;

    const user = await userModel.updateUser(String(req.params.id), {
      name, age, city, address, bio, lookingFor, image, status, relationshipIntent, interests, phone, telegram, instagram, email,
    });

    if (!user) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    res.json({ user: userRowToProfile(user as any) });
  } catch (err: any) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;

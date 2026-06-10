import { Router, Response } from 'express';
import * as userModel from '../models/user.model';
import { authenticate, AuthRequest } from '../middleware/auth';
import { userRowToProfile } from '../utils/transform';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { gender, lookingFor, city, intent, search, minAge, maxAge, page, limit } = req.query;
    const result = await userModel.findUsersWithFilters({
      gender: gender as string | undefined,
      lookingFor: lookingFor as string | undefined,
      city: city as string | undefined,
      intent: intent as string | undefined,
      search: search as string | undefined,
      minAge: minAge ? Number(minAge) : undefined,
      maxAge: maxAge ? Number(maxAge) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    const profiles = result.rows.map((row: any) => userRowToProfile(row));
    res.json({ profiles, total: result.total });
  } catch (err: any) {
    console.error('Get profiles error:', err);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
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

    await userModel.updateUser(String(req.params.id), {
      name, age, city, address, bio, lookingFor, image, status, relationshipIntent, interests, phone, telegram, instagram, email,
    });

    const user = await userModel.findUserById(String(req.params.id));
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

import { Router, Response } from 'express';
import * as userModel from '../models/user.model';
import { authenticate, AuthRequest } from '../middleware/auth';
import { userRowToProfile } from '../utils/transform';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { gender, lookingFor, city, intent, search, minAge, maxAge, page, limit } = req.query;
    const filters = {
      gender: gender ? String(gender) : undefined,
      lookingFor: lookingFor ? String(lookingFor) : undefined,
      city: city ? String(city) : undefined,
      intent: intent ? String(intent) : undefined,
      search: search ? String(search) : undefined,
      minAge: minAge ? parseInt(String(minAge), 10) : undefined,
      maxAge: maxAge ? parseInt(String(maxAge), 10) : undefined,
      page: page ? parseInt(String(page), 10) : undefined,
      limit: limit ? parseInt(String(limit), 10) : undefined,
    };
    const result = await userModel.getProfilesFiltered(filters);

    const host = req.get('host');
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    const mappedProfiles = result.profiles.map(p => ({
      ...p,
      image: p.image && p.image.startsWith('/api/') ? `${baseUrl}${p.image}` : p.image
    }));

    res.json({ profiles: mappedProfiles, total: result.total });
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

router.get('/:id/image', async (req: AuthRequest, res: Response) => {
  try {
    const user = await userModel.findUserById(String(req.params.id));
    if (!user || !user.image) {
      res.status(404).send('Not found');
      return;
    }

    const imgStr = user.image;
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
    console.error('Image fetch error:', err);
    res.status(500).send('Error');
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const user = await userModel.findUserById(String(req.params.id));
    if (!user) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    const host = req.get('host');
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    res.json({ profile: userRowToProfile(user as any, baseUrl) });
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

    const { name, age, city, address, bio, lookingFor, image, status, relationshipIntent, interests, contactInfo } = req.body;
    const phone = req.body.phone ?? contactInfo?.phone;
    const telegram = req.body.telegram ?? contactInfo?.telegram;
    const instagram = req.body.instagram ?? contactInfo?.instagram;
    const email = req.body.email ?? contactInfo?.email;

    const user = await userModel.updateUser(String(req.params.id), {
      name, age, city, address, bio, lookingFor, image, status, relationshipIntent, interests, phone, telegram, instagram, email,
    });

    if (!user) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    const host = req.get('host');
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    res.json({ user: userRowToProfile(user as any, baseUrl) });
  } catch (err: any) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;

import { Router, Response } from 'express';
import path from 'path';
import * as userModel from '../models/user.model';
import * as paymentModel from '../models/payment.model';
import { authenticate, optionalAuthenticate, AuthRequest } from '../middleware/auth';
import { userRowToProfile } from '../utils/transform';

const router = Router();

function maskPhone(val: string | null) {
  if (!val) return '';
  const digits = val.replace(/\D/g, '');
  if (digits.length >= 9) return digits.slice(0, 2) + 'XX XXX' + digits.slice(-3);
  return val.slice(0, 3) + '***';
}

function maskHandle(val: string | null) {
  if (!val || val === '---') return '---';
  const at = val.startsWith('@') ? '@' : '';
  const body = val.replace(/^@/, '');
  if (body.length <= 2) return at + body + '***';
  return at + body.slice(0, 2) + '...';
}

router.get('/', optionalAuthenticate, async (req: AuthRequest, res: Response) => {
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

    let showAll = false;
    if (req.isAdmin) {
      showAll = true;
    } else if (req.userId) {
      const currentUser = await userModel.findUserById(req.userId);
      if (currentUser) {
        if (currentUser.gender === 'Female' || currentUser.verified === 1 || currentUser.verified === true) {
          showAll = true;
        } else {
          showAll = await paymentModel.hasApprovedPayment(req.userId);
        }
      }
    }

    const responseProfiles = result.profiles.map((p: any) => {
      const allowed = showAll || (req.userId && req.userId === p.id);
      if (allowed) {
        return p;
      } else {
        return {
          ...p,
          contactInfo: {
            phone: maskPhone(p.contactInfo.phone),
            telegram: maskHandle(p.contactInfo.telegram),
            instagram: maskHandle(p.contactInfo.instagram),
            email: maskHandle(p.contactInfo.email),
          }
        };
      }
    });

    res.json({ profiles: responseProfiles, total: result.total });
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
    const dataMatch = imgStr.match(/^data:([^;]+);base64,(.+)$/);
    if (dataMatch) {
      const contentType = dataMatch[1];
      const data = Buffer.from(dataMatch[2], 'base64');
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(data);
    } else if (imgStr.startsWith('/')) {
      const publicDir = path.join(process.cwd(), 'public');
      const resolved = path.resolve(publicDir, imgStr.slice(1));
      if (!resolved.startsWith(path.resolve(publicDir))) {
        res.status(403).send('Forbidden');
        return;
      }
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.sendFile(resolved);
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

router.get('/:id', optionalAuthenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await userModel.findUserById(String(req.params.id));
    if (!user) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    const profile = userRowToProfile(user as any);

    let allowed = false;
    if (req.isAdmin) {
      allowed = true;
    } else if (req.userId && req.userId === profile.id) {
      allowed = true;
    } else if (req.userId) {
      const currentUser = await userModel.findUserById(req.userId);
      if (currentUser) {
        if (currentUser.gender === 'Female' || currentUser.verified === 1 || currentUser.verified === true) {
          allowed = true;
        } else {
          allowed = await paymentModel.hasApprovedPayment(req.userId);
        }
      }
    }

    if (!allowed) {
      profile.contactInfo = {
        phone: maskPhone(profile.contactInfo.phone),
        telegram: maskHandle(profile.contactInfo.telegram),
        instagram: maskHandle(profile.contactInfo.instagram),
        email: maskHandle(profile.contactInfo.email),
      };
    }

    res.json({ profile });
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

    res.json({ user: userRowToProfile(user as any) });
  } catch (err: any) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;

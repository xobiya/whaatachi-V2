import { Router, Response } from 'express';
import { v4 as uuid } from 'uuid';
import * as userModel from '../models/user.model';
import { generateToken, authenticate, optionalAuthenticate, AuthRequest } from '../middleware/auth';
import { validateRegister, validateLogin } from '../middleware/validate';
import { userRowToProfile } from '../utils/transform';

const router = Router();

router.post('/register', validateRegister, async (req: AuthRequest, res: Response) => {
  try {
    const { name, age, city, address, bio, gender, lookingFor, image, status, relationshipIntent, interests, phone, telegram, instagram, email } = req.body;

    const conflicts: string[] = [];
    if (email && await userModel.checkDuplicate('email', email)) conflicts.push('email');
    if (phone && await userModel.checkDuplicate('phone', phone)) conflicts.push('phone');
    if (telegram && await userModel.checkDuplicate('telegram', telegram)) conflicts.push('telegram');
    if (instagram && await userModel.checkDuplicate('instagram', instagram)) conflicts.push('instagram');
    if (conflicts.length > 0) {
      res.status(409).json({ error: `A user with this ${conflicts.join(', ')} already exists` });
      return;
    }

    const id = uuid();
    const created = await userModel.createUser({
      id, name, age, city, address, bio, gender, lookingFor, image,
      status, relationshipIntent,
      interests,
      phone, telegram, instagram, email,
    });

    if (!created) {
      res.status(500).json({ error: 'Failed to create user' });
      return;
    }

    const token = generateToken({ id });
    const plain = typeof created.toObject === 'function' ? created.toObject() : created;
    res.status(201).json({ token, user: userRowToProfile(plain) });
  } catch (err: any) {
    console.error('Register error:', err);
    if (err?.code === 11000) {
      res.status(409).json({ error: 'A user with this information already exists' });
      return;
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', validateLogin, async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, telegram, instagram } = req.body;

    let found: any = null;

    if (phone) {
      found = await userModel.findUserByPhone(phone);
    }

    if (!found && (telegram || instagram)) {
      found = await userModel.findUserByContact(telegram || null, instagram || null);
    }

    if (!found && name) {
      const users = await userModel.findUserByName(name);
      if (users.length > 0) {
        found = users[0];
        if (phone) {
          const normalizedPhone = phone.replace(/\s/g, '');
          const exact = users.find(
            (u: any) => u.phone?.replace(/\s/g, '') === normalizedPhone
          );
          if (exact) found = exact;
        }
      }
    }

    if (!found) {
      res.status(404).json({ error: 'No account found with the provided information' });
      return;
    }

    const token = generateToken({ id: found._id });
    res.json({ token, user: userRowToProfile(found as any) });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', (_req: AuthRequest, res: Response) => {
  res.json({ success: true });
});

router.get('/me', optionalAuthenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.json({ user: null });
      return;
    }
    const user = await userModel.findUserById(req.userId);
    if (!user) {
      res.json({ user: null });
      return;
    }
    res.json({ user: userRowToProfile(user as any) });
  } catch (err: any) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;

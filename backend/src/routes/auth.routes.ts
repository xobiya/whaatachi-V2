import { Router, Response } from 'express';
import { v4 as uuid } from 'uuid';
import * as userModel from '../models/user.model';
import { generateToken, authenticate, AuthRequest } from '../middleware/auth';
import { validateRegister, validateLogin } from '../middleware/validate';
import { userRowToProfile } from '../utils/transform';

const router = Router();

router.post('/register', validateRegister, async (req: AuthRequest, res: Response) => {
  try {
    const { name, age, city, address, bio, gender, lookingFor, image, status, relationshipIntent, interests, phone, telegram, instagram, email } = req.body;

    const id = uuid();
    await userModel.createUser({
      id, name, age, city, address, bio, gender, lookingFor, image,
      status, relationshipIntent,
      interests: interests ? JSON.stringify(interests) : undefined,
      phone, telegram, instagram, email,
    });

    const user = await userModel.findUserById(id);
    if (!user) {
      res.status(500).json({ error: 'Failed to create user' });
      return;
    }

    const token = generateToken({ id });
    res.status(201).json({ token, user: userRowToProfile(user) });
  } catch (err: any) {
    console.error('Register error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'A user with this information already exists' });
      return;
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', validateLogin, async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone } = req.body;
    const users = await userModel.findUserByName(name);

    if (users.length === 0) {
      res.status(404).json({ error: 'No account found with that name' });
      return;
    }

    let found = users[0];
    if (phone) {
      const normalizedPhone = phone.replace(/\s/g, '');
      const exact = users.find(
        (u) => u.phone?.replace(/\s/g, '') === normalizedPhone
      );
      if (exact) found = exact;
    }

    const token = generateToken({ id: found.id });
    res.json({ token, user: userRowToProfile(found) });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await userModel.findUserById(req.userId!);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user: userRowToProfile(user) });
  } catch (err: any) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;

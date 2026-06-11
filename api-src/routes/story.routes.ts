import { Router, Response } from 'express';
import { v4 as uuid } from 'uuid';
import * as storyModel from '../models/story.model';
import { authenticate, adminOnly, AuthRequest } from '../middleware/auth';
import { validateStory } from '../middleware/validate';
import { storyRowToStory } from '../utils/transform';

const router = Router();

router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const rows = await storyModel.findAllStories();
    const stories = rows.map((r: any) => storyRowToStory(r));
    res.json({ stories });
  } catch (err: any) {
    console.error('Get stories error:', err);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

router.post('/', authenticate, adminOnly, validateStory, async (req: AuthRequest, res: Response) => {
  try {
    const { coupleNames, story, year, image } = req.body;
    const id = uuid();

    const created = await storyModel.createStory({ id, coupleNames, story, year, image });
    const plain = typeof created.toObject === 'function' ? created.toObject() : created;
    res.status(201).json({ story: storyRowToStory(plain) });
  } catch (err: any) {
    console.error('Create story error:', err);
    res.status(500).json({ error: 'Failed to create story' });
  }
});

router.delete('/:id', authenticate, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    await storyModel.deleteStory(String(req.params.id));
    res.json({ success: true });
  } catch (err: any) {
    console.error('Delete story error:', err);
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

export default router;

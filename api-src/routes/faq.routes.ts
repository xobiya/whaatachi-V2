import { Router, Response } from 'express';
import { v4 as uuid } from 'uuid';
import * as faqModel from '../models/faq.model';
import { authenticate, adminOnly, AuthRequest } from '../middleware/auth';
import { getCached, setCache, clearCacheByPrefix } from '../utils/cache';

const router = Router();
const FAQ_CACHE_KEY = 'faq:grouped';

router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const cached = getCached<Record<string, { question: string; answer: string }[]>>(FAQ_CACHE_KEY);
    if (cached) {
      res.json({ faqs: cached });
      return;
    }
    const rows = await faqModel.findAllFaqs();
    const grouped: Record<string, { question: string; answer: string }[]> = {};
    for (const faq of rows) {
      if (!grouped[faq.category]) grouped[faq.category] = [];
      grouped[faq.category].push({ question: faq.question, answer: faq.answer });
    }
    setCache(FAQ_CACHE_KEY, grouped, 300000);
    res.json({ faqs: grouped });
  } catch (err: any) {
    console.error('Get faqs error:', err);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

router.get('/all', authenticate, adminOnly, async (_req: AuthRequest, res: Response) => {
  try {
    const rows = await faqModel.findAllFaqs();
    res.json({ faqs: rows });
  } catch (err: any) {
    console.error('Get all faqs error:', err);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

router.post('/', authenticate, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { category, question, answer, sortOrder } = req.body;
    if (!category || !question || !answer) {
      res.status(400).json({ error: 'category, question, and answer are required' });
      return;
    }
    const id = uuid();
    await faqModel.createFaq({ id, category, question, answer, sortOrder });
    clearCacheByPrefix('faq:');
    res.status(201).json({ faq: { id, category, question, answer, sortOrder } });
  } catch (err: any) {
    console.error('Create faq error:', err);
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
});

router.put('/:id', authenticate, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { category, question, answer, sortOrder } = req.body;
    const faq = await faqModel.updateFaq(id, { category, question, answer, sortOrder });
    if (!faq) {
      res.status(404).json({ error: 'FAQ not found' });
      return;
    }
    clearCacheByPrefix('faq:');
    res.json({ faq });
  } catch (err: any) {
    console.error('Update faq error:', err);
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

router.delete('/:id', authenticate, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    await faqModel.deleteFaq(String(req.params.id));
    clearCacheByPrefix('faq:');
    res.json({ success: true });
  } catch (err: any) {
    console.error('Delete faq error:', err);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

export default router;

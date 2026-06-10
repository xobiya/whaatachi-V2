import { Router, Response } from 'express';
import { v4 as uuid } from 'uuid';
import * as faqModel from '../models/faq.model';
import { authenticate, adminOnly, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const rows = await faqModel.findAllFaqs();
    const grouped: Record<string, { question: string; answer: string }[]> = {};
    for (const faq of rows) {
      if (!grouped[faq.category]) grouped[faq.category] = [];
      grouped[faq.category].push({ question: faq.question, answer: faq.answer });
    }
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
    const faq = await faqModel.findFaqById(id);
    res.status(201).json({ faq });
  } catch (err: any) {
    console.error('Create faq error:', err);
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
});

router.put('/:id', authenticate, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { category, question, answer, sortOrder } = req.body;
    await faqModel.updateFaq(id, { category, question, answer, sortOrder });
    const faq = await faqModel.findFaqById(id);
    if (!faq) {
      res.status(404).json({ error: 'FAQ not found' });
      return;
    }
    res.json({ faq });
  } catch (err: any) {
    console.error('Update faq error:', err);
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

router.delete('/:id', authenticate, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    await faqModel.deleteFaq(String(req.params.id));
    res.json({ success: true });
  } catch (err: any) {
    console.error('Delete faq error:', err);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

export default router;

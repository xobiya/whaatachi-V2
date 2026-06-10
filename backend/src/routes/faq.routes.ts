import { Router, Response } from 'express';
import * as faqModel from '../models/faq.model';
import { AuthRequest } from '../middleware/auth';

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

export default router;

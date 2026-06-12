import { Router, Response } from 'express';
import { v4 as uuid } from 'uuid';
import * as articleModel from '../models/article.model';
import { authenticate, adminOnly, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', async (_req: AuthRequest, res: Response) => {
  try {
    const rows = await articleModel.findAllArticles();
    const articles = rows.map((r: any) => ({
      id: r.id || r._id,
      title: r.title,
      excerpt: r.excerpt,
      category: r.category,
      readTime: r.readTime,
      date: r.date,
      image: r.image,
      content: r.content,
    }));
    res.json({ articles });
  } catch (err: any) {
    console.error('Get articles error:', err);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const article = await articleModel.findArticleById(String(req.params.id));
    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }
    res.json({ article: {
      id: article.id || article._id,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      readTime: article.readTime,
      date: article.date,
      image: article.image,
      content: article.content,
    } });
  } catch (err: any) {
    console.error('Get article error:', err);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

router.post('/', authenticate, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { title, excerpt, category, readTime, date, image, content } = req.body;
    const id = uuid();
    const created = await articleModel.createArticle({ id, title, excerpt, category, readTime, date, image, content });
    const plain = typeof created.toObject === 'function' ? created.toObject() : created;
    res.status(201).json({ article: plain });
  } catch (err: any) {
    console.error('Create article error:', err);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

router.delete('/:id', authenticate, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    await articleModel.deleteArticle(String(req.params.id));
    res.json({ success: true });
  } catch (err: any) {
    console.error('Delete article error:', err);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

export default router;

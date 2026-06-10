import { query } from '../config/database';
import { ArticleRow } from '../types';

export async function findAllArticles(): Promise<ArticleRow[]> {
  const rows: any = await query('SELECT * FROM articles ORDER BY createdAt DESC');
  return rows as ArticleRow[];
}

export async function findArticleById(id: string): Promise<ArticleRow | null> {
  const rows: any = await query('SELECT * FROM articles WHERE id = ?', [id]);
  return rows.length ? (rows[0] as ArticleRow) : null;
}

export async function createArticle(data: {
  id: string;
  title: string;
  excerpt?: string;
  category?: string;
  readTime?: string;
  date?: string;
  image?: string;
  content?: string;
}): Promise<void> {
  await query(
    `INSERT INTO articles (id, title, excerpt, category, readTime, date, image, content)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.id, data.title, data.excerpt ?? null, data.category ?? null,
     data.readTime ?? null, data.date ?? null, data.image ?? null, data.content ?? null]
  );
}

export async function deleteArticle(id: string): Promise<void> {
  await query('DELETE FROM articles WHERE id = ?', [id]);
}

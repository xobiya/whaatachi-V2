import { query } from '../config/database';
import { FaqRow } from '../types';

export async function findAllFaqs(): Promise<FaqRow[]> {
  const rows: any = await query('SELECT * FROM faqs ORDER BY sortOrder ASC, createdAt ASC');
  return rows as FaqRow[];
}

export async function createFaq(data: {
  id: string;
  category: string;
  question: string;
  answer: string;
  sortOrder?: number;
}): Promise<void> {
  await query(
    `INSERT INTO faqs (id, category, question, answer, sortOrder)
     VALUES (?, ?, ?, ?, ?)`,
    [data.id, data.category, data.question, data.answer, data.sortOrder ?? 0]
  );
}

export async function deleteFaq(id: string): Promise<void> {
  await query('DELETE FROM faqs WHERE id = ?', [id]);
}

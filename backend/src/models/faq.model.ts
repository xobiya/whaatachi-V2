import { query } from '../config/database';
import { FaqRow } from '../types';

export async function findFaqById(id: string): Promise<FaqRow | null> {
  const rows: any = await query('SELECT * FROM faqs WHERE id = ?', [id]);
  return rows.length ? (rows[0] as FaqRow) : null;
}

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

export async function updateFaq(id: string, data: {
  category?: string;
  question?: string;
  answer?: string;
  sortOrder?: number;
}): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];
  if (data.category !== undefined) { fields.push('category = ?'); values.push(data.category); }
  if (data.question !== undefined) { fields.push('question = ?'); values.push(data.question); }
  if (data.answer !== undefined) { fields.push('answer = ?'); values.push(data.answer); }
  if (data.sortOrder !== undefined) { fields.push('sortOrder = ?'); values.push(data.sortOrder); }
  if (fields.length === 0) return;
  values.push(id);
  await query(`UPDATE faqs SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function deleteFaq(id: string): Promise<void> {
  await query('DELETE FROM faqs WHERE id = ?', [id]);
}

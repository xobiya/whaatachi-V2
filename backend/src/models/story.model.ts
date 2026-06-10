import { query } from '../config/database';
import { StoryRow } from '../types';

export async function findAllStories(): Promise<StoryRow[]> {
  const rows: any = await query('SELECT * FROM success_stories ORDER BY createdAt DESC');
  return rows as StoryRow[];
}

export async function createStory(data: {
  id: string;
  coupleNames: string;
  story: string;
  year?: string;
  image?: string;
}): Promise<void> {
  await query(
    'INSERT INTO success_stories (id, coupleNames, story, year, image) VALUES (?, ?, ?, ?, ?)',
    [data.id, data.coupleNames, data.story, data.year ?? null, data.image ?? null]
  );
}

export async function deleteStory(id: string): Promise<void> {
  await query('DELETE FROM success_stories WHERE id = ?', [id]);
}

export async function countStories(): Promise<number> {
  const rows: any = await query('SELECT COUNT(*) as count FROM success_stories');
  return rows[0].count;
}

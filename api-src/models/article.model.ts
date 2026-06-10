import mongoose, { Schema } from 'mongoose';

const articleSchema = new Schema({
  _id: { type: String },
  title: { type: String, required: true },
  excerpt: String,
  category: String,
  readTime: String,
  date: String,
  image: String,
  content: String,
}, { timestamps: true, _id: false });

const Article = mongoose.model('Article', articleSchema) as any;

export async function findAllArticles(): Promise<any[]> {
  return Article.find().sort({ createdAt: -1 }).lean();
}

export async function findArticleById(id: string): Promise<any> {
  return Article.findById(id).lean();
}

export async function createArticle(data: Record<string, any>): Promise<any> {
  return Article.create({
    _id: data.id,
    title: data.title,
    excerpt: data.excerpt,
    category: data.category,
    readTime: data.readTime,
    date: data.date,
    image: data.image,
    content: data.content,
  });
}

export async function deleteArticle(id: string): Promise<void> {
  await Article.findByIdAndDelete(id);
}

export default Article;

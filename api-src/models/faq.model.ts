import mongoose, { Schema } from 'mongoose';

const faqSchema = new Schema({
  _id: { type: String },
  category: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true, _id: false });

const Faq = mongoose.model('Faq', faqSchema) as any;

export async function findFaqById(id: string): Promise<any> {
  return Faq.findById(id).lean();
}

export async function findAllFaqs(): Promise<any[]> {
  return Faq.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
}

export async function createFaq(data: Record<string, any>): Promise<any> {
  return Faq.create({
    _id: data.id,
    category: data.category,
    question: data.question,
    answer: data.answer,
    sortOrder: data.sortOrder ?? 0,
  });
}

export async function updateFaq(id: string, data: Record<string, any>): Promise<void> {
  const update: Record<string, any> = {};
  if (data.category !== undefined) update.category = data.category;
  if (data.question !== undefined) update.question = data.question;
  if (data.answer !== undefined) update.answer = data.answer;
  if (data.sortOrder !== undefined) update.sortOrder = data.sortOrder;
  if (Object.keys(update).length > 0) {
    await Faq.findByIdAndUpdate(id, { $set: update });
  }
}

export async function deleteFaq(id: string): Promise<void> {
  await Faq.findByIdAndDelete(id);
}

export async function countFaqs(): Promise<number> {
  return Faq.countDocuments();
}

export default Faq;

import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://Vercel-Admin-whaatachi-v1:vIz5Cxt9njkKc2Jswhaatachi-v1.xq6ob1e.mongodb.net/?appName=whaatachi-v1';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
}

export default mongoose;

import mongoose from 'mongoose';

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI environment variable is not set');

  if (mongoose.connection.readyState === 1) return mongoose;

  await mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

  return mongoose;
}

export default mongoose;

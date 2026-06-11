import mongoose from 'mongoose';

const cachedConnection: { conn?: typeof mongoose; promise?: Promise<typeof mongoose> } = {};

export async function connectDB(): Promise<typeof mongoose> {
  if (cachedConnection.conn) return cachedConnection.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  if (!cachedConnection.promise) {
    cachedConnection.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
  }

  cachedConnection.conn = await cachedConnection.promise;
  return cachedConnection.conn;
}

export default mongoose;

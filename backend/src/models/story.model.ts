import mongoose, { Schema } from 'mongoose';

const storySchema = new Schema({
  _id: { type: String },
  coupleNames: { type: String, required: true },
  story: { type: String, required: true },
  year: String,
  image: String,
}, { timestamps: true, _id: false });

const Story = mongoose.model('Story', storySchema) as any;

export async function findAllStories(): Promise<any[]> {
  return Story.find().sort({ createdAt: -1 }).lean();
}

export async function createStory(data: Record<string, any>): Promise<any> {
  return Story.create({
    _id: data.id,
    coupleNames: data.coupleNames,
    story: data.story,
    year: data.year,
    image: data.image,
  });
}

export async function deleteStory(id: string): Promise<void> {
  await Story.findByIdAndDelete(id);
}

export async function countStories(): Promise<number> {
  return Story.countDocuments();
}

export default Story;

export interface Profile {
  id: string;
  name: string;
  age: number;
  city: string;
  address?: string;
  bio: string;
  gender: 'Male' | 'Female';
  lookingFor?: 'Male' | 'Female';
  image: string;
  status: 'Online' | 'Offline' | 'Recently Active';
  relationshipIntent: 'True Relationship' | 'Friendship' | 'Friends with Benefits' | 'Only Sex';
  interests: string[];
  verified: boolean;
  contactInfo: {
    phone: string;
    telegram: string;
    instagram: string;
    email: string;
  };
}

export interface PaymentRequest {
  id: string;
  profileId: string;
  profileName: string;
  profileImage: string;
  senderName: string;
  senderPhone: string;
  transactionId: string;
  method: 'Telebirr' | 'CBE Birr';
  amount: number;
  timestamp: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  receiptImage?: string;
}

export interface SuccessStory {
  id: string;
  coupleNames: string;
  story: string;
  year: string;
  image: string;
}

export interface AdminStats {
  totalUsers: number;
  maleUsers: number;
  femaleUsers: number;
  verifiedUsers: number;
  pendingPayments: number;
  approvedPayments: number;
  revenue: number;
  totalStories: number;
}

export interface UserRow {
  id: string;
  name: string;
  age: number | null;
  city: string | null;
  address: string | null;
  bio: string | null;
  gender: 'Male' | 'Female';
  lookingFor: 'Male' | 'Female' | null;
  image: string | null;
  status: 'Online' | 'Offline' | 'Recently Active';
  relationshipIntent: string | null;
  interests: string | null;
  verified: number;
  phone: string | null;
  telegram: string | null;
  instagram: string | null;
  email: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRow {
  id: string;
  userId: string;
  profileId: string;
  profileName: string;
  profileImage: string | null;
  senderName: string;
  senderPhone: string;
  transactionId: string;
  method: 'Telebirr' | 'CBE Birr';
  amount: number;
  receiptImage: string | null;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  updatedAt: string;
}

export interface StoryRow {
  id: string;
  coupleNames: string;
  story: string;
  year: string | null;
  image: string | null;
  createdAt: string;
}

export interface AdminRow {
  id: number;
  username: string;
  password: string;
  createdAt: string;
}

export interface ArticleRow {
  id: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  readTime: string | null;
  date: string | null;
  image: string | null;
  content: string | null;
  createdAt: string;
}

export interface FaqRow {
  id: string;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
  createdAt: string;
}

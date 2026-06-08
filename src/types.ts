export interface Profile {
  id: string;
  name: string;
  age: number;
  city: string;
  bio: string;
  gender: 'Male' | 'Female';
  lookingFor?: 'Male' | 'Female';
  image: string;
  status: 'Online' | 'Offline' | 'Recently Active';
  relationshipIntent: 'True Relationship' | 'Friendship' | 'Friends with Benefits';
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
  profileId: string; // The ID of the profile being unlocked
  profileName: string; // The name of the profile being unlocked
  profileImage: string;
  senderName: string; // The user who submitted the payment
  senderPhone: string;
  transactionId: string;
  method: 'Telebirr' | 'CBE Birr';
  amount: number;
  timestamp: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface SuccessStory {
  id: string;
  coupleNames: string;
  story: string;
  year: string;
  image: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  content: string;
}

export interface SupportMessage {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  text: string;
  timestamp: Date;
}

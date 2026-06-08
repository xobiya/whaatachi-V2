import { Profile, SuccessStory, Article } from './types';

const asset = (file: string) => `/assets/${file}`;

const FEMALE_IMAGES = [
  asset('Gemini_Generated_Image_48jenf48jenf48je.png'),
  asset('Gemini_Generated_Image_4zte6t4zte6t4zte.png'),
  asset('Gemini_Generated_Image_69df6669df6669df.png'),
  asset('ChatGPT Image Jun 8, 2026, 03_15_56 PM.png'),
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
];

const MALE_IMAGES = [
  asset('Gemini_Generated_Image_f05mrgf05mrgf05m.png'),
  asset('Gemini_Generated_Image_rj3k3urj3k3urj3k.png'),
  asset('photo_2026-06-08_16-58-42.jpg'),
  asset('Gemini_Generated_Image_oicvomoicvomoicv.png'),
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
];

const CITIES = ['Addis Ababa', 'Adama', 'Hawassa', 'Bahir Dar', 'Dire Dawa', 'Gondar', 'Mekelle', 'Jimma', 'Dessie', 'Harar'];
const INTENTS: ('True Relationship' | 'Friendship' | 'Friends with Benefits')[] = ['True Relationship', 'Friendship', 'Friends with Benefits'];
const INTERESTS_POOL = [
  'Coffee Ceremony', 'Macchiato', 'Technology', 'Literature', 'Jazz', 'Hiking',
  'Photography', 'Art Galleries', 'Traditional Food', 'Fitness', 'Philosophy',
  'Business', 'Road Trips', 'Tennis', 'Volunteering', 'History',
  'Cooking', 'Content Creation', 'Bole Cafes', 'Design',
  'Lake Walks', 'Acoustic Music', 'Family Values', 'Travel',
  'Music', 'Dancing', 'Reading', 'Movies', 'Fashion', 'Sports'
];
const STATUSES: ('Online' | 'Offline' | 'Recently Active')[] = ['Online', 'Offline', 'Recently Active'];

const femaleNames = [
  'Selamawit Tekle', 'Kidist Hailu', 'Helen Gebru', 'Bethel Elias',
  'Hana Kassa', 'Martha Tesfaye', 'Tigist Alene', 'Eden Girma',
  'Meron Alemu', 'Tsion Wondimu', 'Birtukan Desta', 'Mahlet Ayele',
  'Frehiwot Eshetu', 'Ruth Getachew', 'Sosina Tadesse', 'Likina Amare',
  'Bethlehem Assefa', 'Mekdes Hailu', 'Yordanos Mengistu', 'Hiwot Belay'
];

const maleNames = [
  'Abel Mekonnen', 'Daniel Tadesse', 'Nahom Girma', 'Samuel Solomon',
  'Elias Shiferaw', 'Yohannes Bekele', 'Michael Tsegaye', 'Bereket Kebede',
  'Dawit Haile', 'Henok Tesfaye', 'Binyam Alemu', 'Yonas Gebre',
  'Ermias Wondimu', 'Mikiyas Tadesse', 'Nebiyu Fekadu', 'Kalkidan Hailu',
  'Biruk Assefa', 'Surafel Girma', 'Natnael Abebe', 'Yared Getachew'
];

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomN<T>(arr: T[], n: number): T[] {
  return shuffleArray(arr).slice(0, n);
}

function generateProfiles(): Profile[] {
  const profiles: Profile[] = [];

  femaleNames.forEach((name, i) => {
    const id = `f${i + 1}`;
    profiles.push({
      id,
      name,
      age: 21 + Math.floor(Math.random() * 12),
      city: pickRandom(CITIES),
      bio: pickRandom([
        `I love exploring new cafes in Addis and meeting genuine people. Looking for someone who values real connection.`,
        `Passionate about my career and culture. Looking for a true gentleman who respects traditions.`,
        `Coffee lover, book enthusiast, and weekend hiker. Let's share stories over macchiato.`,
        `Family-oriented professional looking for a serious relationship built on trust and respect.`,
        `Adventurous spirit who loves traveling across Ethiopia's beautiful landscapes. Seeking a partner in crime.`,
        `Creative soul who enjoys art, music, and deep conversations. Let's explore Bole together.`,
        `Faith-driven woman looking for a God-fearing man for a lasting relationship.`,
        `Foodie who loves traditional Ethiopian cuisine and trying new restaurants. Looking for someone to share meals with.`,
        `Yoga enthusiast and wellness coach. Seeking a balanced, healthy relationship.`,
        `Dedicated professional who also values quality time with family. Looking for my missing piece.`,
      ]),
      gender: 'Female',
      image: FEMALE_IMAGES[i % FEMALE_IMAGES.length],
      status: pickRandom(STATUSES),
      relationshipIntent: pickRandom(INTENTS),
      interests: pickRandomN(INTERESTS_POOL, 3),
      verified: Math.random() > 0.3,
      contactInfo: {
        phone: `+251 91${String(Math.floor(1000000 + Math.random() * 9000000)).padStart(7, '0')}`,
        telegram: `@${name.split(' ')[0].toLowerCase()}_${String(Math.floor(Math.random() * 1000))}`,
        instagram: `@${name.split(' ')[0].toLowerCase()}_eth`,
        email: `${name.split(' ')[0].toLowerCase()}.${name.split(' ')[1].toLowerCase()}@example.com`,
      }
    });
  });

  maleNames.forEach((name, i) => {
    const id = `m${i + 1}`;
    profiles.push({
      id,
      name,
      age: 22 + Math.floor(Math.random() * 14),
      city: pickRandom(CITIES),
      bio: pickRandom([
        `Hardworking professional looking for a genuine connection. I appreciate honesty and good conversation over coffee.`,
        `Entrepreneur by day, music lover by night. Seeking a smart, kind woman to share life with.`,
        `Sports enthusiast and fitness lover. Looking for someone who values health and happiness.`,
        `Engineer with a passion for travel and photography. Let's explore Ethiopia together.`,
        `Family man at heart. Looking for a serious relationship that leads to marriage.`,
        `Creative professional who enjoys art galleries, live music, and Ethiopian cuisine.`,
        `Ambitious and driven, but know how to relax. Looking for a partner who balances work and life.`,
        `Simple guy who values loyalty, respect, and good vibes. Let's start with coffee and see where it goes.`,
        `Tech startup founder who also loves traditional coffee ceremonies. Seeking a genuine connection.`,
        `Adventure seeker who loves road trips to Lalibela and the Northern Mountains. Join me!`,
      ]),
      gender: 'Male',
      image: MALE_IMAGES[i % MALE_IMAGES.length],
      status: pickRandom(STATUSES),
      relationshipIntent: pickRandom(INTENTS),
      interests: pickRandomN(INTERESTS_POOL, 3),
      verified: Math.random() > 0.3,
      contactInfo: {
        phone: `+251 91${String(Math.floor(1000000 + Math.random() * 9000000)).padStart(7, '0')}`,
        telegram: `@${name.split(' ')[0].toLowerCase()}_${String(Math.floor(Math.random() * 1000))}`,
        instagram: `@${name.split(' ')[0].toLowerCase()}_eth`,
        email: `${name.split(' ')[0].toLowerCase()}.${name.split(' ')[1].toLowerCase()}@example.com`,
      }
    });
  });

  return profiles;
}

export const INITIAL_PROFILES: Profile[] = generateProfiles();

export const INITIAL_SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 's1',
    coupleNames: 'Selam & Dawit',
    story: 'We met on Whaatachi in late 2024. After chatting for two weeks about architecture and Addis cafe culture, we met for coffee at Tomoca in Bole. Now we are engaged!',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 's2',
    coupleNames: 'Hana & Michael',
    story: 'I was skeptical about online dating in Ethiopia, but Whaatachi felt secure. Michael verified his profile through Telebirr payment and reached out. We connected over volunteer work.',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'a1',
    title: 'The Modern Ethiopian Guide to Digital Courtship',
    excerpt: 'Dating in Ethiopia is shifting towards digital spaces. Learn how to navigate text etiquette, secure verification, and the transition from app to initial coffee dates.',
    category: 'Relationship Guide',
    readTime: '6 min read',
    date: 'June 5, 2026',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    content: 'Dating in Ethiopia has traditionally been built on community connections. However, in the modern era of fast-paced cities like Addis Ababa, young professionals are increasingly turning to dedicated platforms to find meaningful relationships.'
  },
  {
    id: 'a2',
    title: 'Staying Safe While Connecting Online',
    excerpt: 'Essential digital safety tips tailored for dating platforms in Ethiopian cities.',
    category: 'Safety First',
    readTime: '4 min read',
    date: 'May 28, 2026',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
    content: 'Never share your bank account or Telebirr PIN with anyone. Authentic admins will never ask for your OTP or security keys.'
  },
  {
    id: 'a3',
    title: 'The Perfect Initial Habesha Coffee Date Checklist',
    excerpt: 'Simple, low-pressure steps to transition your digital chat into a comfortable real-life meeting.',
    category: 'Dating Tips',
    readTime: '5 min read',
    date: 'April 12, 2026',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    content: 'Keep it casual! A low-pressure afternoon macchiato is far better than a formal dinner. Respect boundaries and focus on laughing together.'
  }
];

export const FAQS = [
  {
    category: 'Payments & Subscriptions',
    items: [
      {
        question: 'Why is there a payment for men but not women?',
        answer: 'To ensure a high safety ratio, reduce spam, and filter for genuine gentlemen. The 200 Birr fee acts as a quality barrier, making our platform safe for everyone.'
      },
      {
        question: 'What payment methods are accepted?',
        answer: 'We accept Telebirr and CBE Birr. Copy our merchant account details, send the payment, and paste your Transaction ID for verification.'
      },
      {
        question: 'How long does verification take?',
        answer: 'Our team reviews submissions 24/7. Accounts are typically verified within 15-30 minutes.'
      }
    ]
  },
  {
    category: 'Profile & Verification',
    items: [
      {
        question: 'What does the Verified badge mean?',
        answer: 'It means the user has been approved by our admin team as a real person physically located in Ethiopia.'
      },
      {
        question: 'Can I change my location and intent?',
        answer: 'Yes! Go to your profile dashboard to update your city, intent, age, and interests.'
      }
    ]
  },
  {
    category: 'Messaging & Discovery',
    items: [
      {
        question: 'How does Contact Unlocking work?',
        answer: 'Click "Unlock Contact", submit payment proof, and the profile\'s phone, Telegram, and Instagram appear in your Unlock History permanently.'
      },
      {
        question: 'Is my data safe?',
        answer: 'Absolutely. Your phone and Telegram are encrypted. They are only revealed to verified members you choose to unlock.'
      }
    ]
  }
];

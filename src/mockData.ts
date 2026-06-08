import { Profile, SuccessStory, Article } from './types';

const asset = (file: string) => `/assets/${file}`;

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'p1',
    name: 'Selamawit Tekle',
    age: 24,
    city: 'Addis Ababa',
    bio: 'Software engineer by day, macchiato enthusiast by night. I am looking for someone who loves deep conversations, good music, and traditional Ethiopian coffee ceremonies.',
    gender: 'Female',
    image: asset('Gemini_Generated_Image_48jenf48jenf48je.png'),
    status: 'Online',
    relationshipIntent: 'True Relationship',
    interests: ['Macchiato', 'Technology', 'Jazz', 'Literature'],
    verified: true,
    contactInfo: {
      phone: '+251 911 234 567',
      telegram: '@selam_tech',
      instagram: '@selamawit_tekle',
      email: 'selamawit.tekle@example.com'
    }
  },
  {
    id: 'p2',
    name: 'Abel Mekonnen',
    age: 27,
    city: 'Addis Ababa',
    bio: 'Architect sketching my way through Addis. I appreciate structural beauty, classical art, and cultural journeys. Let\'s explore the art galleries around Bole together!',
    gender: 'Male',
    image: asset('Gemini_Generated_Image_f05mrgf05mrgf05m.png'),
    status: 'Online',
    relationshipIntent: 'True Relationship',
    interests: ['Architecture', 'Art Galleries', 'Hiking', 'Photography'],
    verified: true,
    contactInfo: {
      phone: '+251 922 456 789',
      telegram: '@abel_sketches',
      instagram: '@abel_mekonnen',
      email: 'abel.mekonnen@example.com'
    }
  },
  {
    id: 'p3',
    name: 'Kidist Hailu',
    age: 26,
    city: 'Hawassa',
    bio: 'Lover of the Hawassa lake views, morning runs, and local fish cutlets. Genuine warmth and honesty are what I look for. Always happy to talk about business and philosophy.',
    gender: 'Female',
    image: asset('Gemini_Generated_Image_4zte6t4zte6t4zte.png'),
    status: 'Recently Active',
    relationshipIntent: 'True Relationship',
    interests: ['Lake Walks', 'Business', 'Philosophy', 'Fitness'],
    verified: true,
    contactInfo: {
      phone: '+251 912 789 123',
      telegram: '@kidu_hailu',
      instagram: '@kidist_hailu',
      email: 'kidist.hailu@example.com'
    }
  },
  {
    id: 'p4',
    name: 'Daniel Tadesse',
    age: 29,
    city: 'Adama',
    bio: 'Business consultant splitting my time between Adama and Addis. Love road trips, acoustic live bands, and playing tennis. Looking for a genuine partner to build a future with.',
    gender: 'Male',
    image: asset('Gemini_Generated_Image_rj3k3urj3k3urj3k.png'),
    status: 'Online',
    relationshipIntent: 'True Relationship',
    interests: ['Road Trips', 'Tennis', 'Acoustic Bands', 'Consulting'],
    verified: false,
    contactInfo: {
      phone: '+251 915 222 333',
      telegram: '@daniel_consult',
      instagram: '@daniel_tadesse',
      email: 'daniel.tadesse@example.com'
    }
  },
  {
    id: 'p5',
    name: 'Helen Gebru',
    age: 23,
    city: 'Bahir Dar',
    bio: 'Medical student passionate about pediatric care and local volunteer work. Let\'s go for an afternoon boat ride on Lake Tana and explore the historic monasteries.',
    gender: 'Female',
    image: asset('Gemini_Generated_Image_69df6669df6669df.png'),
    status: 'Online',
    relationshipIntent: 'Friendship',
    interests: ['Medicine', 'Volunteering', 'Boat Rides', 'History'],
    verified: true,
    contactInfo: {
      phone: '+251 916 333 444',
      telegram: '@helen_gebru',
      instagram: '@helen_gebru',
      email: 'helen.gebru@example.com'
    }
  },
  {
    id: 'p6',
    name: 'Nahom Girma',
    age: 25,
    city: 'Dire Dawa',
    bio: 'Software engineer and street photographer. I love the nostalgic train station aesthetic in Dire Dawa. Looking for dynamic connections that can turn into something beautiful.',
    gender: 'Male',
    image: asset('photo_2026-06-08_16-58-42.jpg'),
    status: 'Recently Active',
    relationshipIntent: 'Friends with Benefits',
    interests: ['Photography', 'Coding', 'Street Food', 'Retro Vibes'],
    verified: true,
    contactInfo: {
      phone: '+251 919 444 555',
      telegram: '@nahom_girma',
      instagram: '@nahom_girma',
      email: 'nahom.girma@example.com'
    }
  },
  {
    id: 'p7',
    name: 'Bethel Elias',
    age: 22,
    city: 'Addis Ababa',
    bio: 'Graphic designer and content creator. I love exploring new cafes in Bole and digital illustration. Seeking someone with open views and similar high energy!',
    gender: 'Female',
    image: asset('ChatGPT Image Jun 8, 2026, 03_15_56 PM.png'),
    status: 'Offline',
    relationshipIntent: 'Friends with Benefits',
    interests: ['Content Creation', 'Bole Cafes', 'Design', 'Active Outings'],
    verified: false,
    contactInfo: {
      phone: '+251 920 111 222',
      telegram: '@bethel_create',
      instagram: '@bethel_elias',
      email: 'bethel.elias@example.com'
    }
  },
  {
    id: 'p8',
    name: 'Samuel Solomon',
    age: 31,
    city: 'Gondar',
    bio: 'Restaurateur and history buff raised around the beautiful castles of Gondar. I love hosting people, preparing traditional cuisine, and having intelligent debates.',
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=500&auto=format&fit=crop&q=80',
    status: 'Recently Active',
    relationshipIntent: 'True Relationship',
    interests: ['History', 'Castle Architecture', 'Traditional Food', 'Cooking'],
    verified: true,
    contactInfo: {
      phone: '+251 924 999 888',
      telegram: '@sam_gondar',
      instagram: '@sam_gondar',
      email: 'sam.solomon@example.com'
    }
  },
  {
    id: 'p9',
    name: 'Hana Kassa',
    age: 25,
    city: 'Addis Ababa',
    bio: 'Professional dancer and yoga instructor. I love the expressive rhythm of traditional Eskesta and modern fusion. Always radiating positive vibes.',
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    status: 'Online',
    relationshipIntent: 'Friendship',
    interests: ['Eskesta', 'Yoga', 'Raw Vegan', 'Spirituality'],
    verified: true,
    contactInfo: {
      phone: '+251 910 888 777',
      telegram: '@hana_dancer',
      instagram: '@hana_kassa',
      email: 'hana.kassa@example.com'
    }
  },
  {
    id: 'p10',
    name: 'Elias Shiferaw',
    age: 28,
    city: 'Addis Ababa',
    bio: 'Salsa instructor and foodie. Life should be lived dynamic and colorful! Looking for a dance partner and potentially a life partner. Fluent in three languages.',
    gender: 'Male',
    image: asset('Gemini_Generated_Image_oicvomoicvomoicv.png'),
    status: 'Online',
    relationshipIntent: 'Friendship',
    interests: ['Salsa', 'Socializing', 'Cooking Class', 'Languages'],
    verified: true,
    contactInfo: {
      phone: '+251 917 555 777',
      telegram: '@elias_salsa',
      instagram: '@elias_shiferaw',
      email: 'elias.shiferaw@example.com'
    }
  },
  {
    id: 'p11',
    name: 'Martha Tesfaye',
    age: 25,
    city: 'Addis Ababa',
    bio: 'Marketing manager and passionate weekend baker. Love exploring independent books and hiking in Entoto Park. Looking for a high-integrity partner.',
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    status: 'Online',
    relationshipIntent: 'True Relationship',
    interests: ['Entoto Hiking', 'Baking', 'Marketing', 'Book Clubs'],
    verified: true,
    contactInfo: {
      phone: '+251 911 888 999',
      telegram: '@martha_tesfaye',
      instagram: '@martha_tesfaye',
      email: 'martha.tesfaye@example.com'
    }
  },
  {
    id: 'p12',
    name: 'Yohannes Bekele',
    age: 28,
    city: 'Addis Ababa',
    bio: 'Tech start-up founder and double macchiato enthusiast. When not building, I enjoy playing acoustic guitar and walking in Bole. Seeking a smart, kind partner.',
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=500&auto=format&fit=crop&q=80',
    status: 'Recently Active',
    relationshipIntent: 'True Relationship',
    interests: ['Startups', 'Acoustic Guitar', 'Bole Walks', 'Double Espresso'],
    verified: true,
    contactInfo: {
      phone: '+251 930 444 222',
      telegram: '@yohannes_b',
      instagram: '@yohannes_bekele',
      email: 'yohannes@example.com'
    }
  },
  {
    id: 'p13',
    name: 'Tigist Alene',
    age: 26,
    city: 'Bahir Dar',
    bio: 'Lover of Lake Tana lakeside breeze, traditional shekla tibs, and local Ethiopian development. Let\'s grab a fresh mango juice and trace our beautiful histories!',
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=500&auto=format&fit=crop&q=80',
    status: 'Online',
    relationshipIntent: 'True Relationship',
    interests: ['Lake Breeze', 'Traditional Food', 'Mango Juice', 'History'],
    verified: true,
    contactInfo: {
      phone: '+251 918 333 999',
      telegram: '@tigist_alene',
      instagram: '@tigist_alene',
      email: 'tigist@example.com'
    }
  },
  {
    id: 'p14',
    name: 'Michael Tsegaye',
    age: 29,
    city: 'Hawassa',
    bio: 'Environmental scientist and amateur cyclist. I love early morning rides around Hawassa lake. Seeking a sincere, values-oriented companion.',
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    status: 'Recently Active',
    relationshipIntent: 'True Relationship',
    interests: ['Cycling', 'Hawassa Lake', 'Conservation', 'Acoustic Music'],
    verified: true,
    contactInfo: {
      phone: '+251 925 101 202',
      telegram: '@miki_tsegaye',
      instagram: '@michael_tsegaye',
      email: 'miki@example.com'
    }
  },
  {
    id: 'p15',
    name: 'Eden Girma',
    age: 24,
    city: 'Addis Ababa',
    bio: 'Anesthesiology resident. Life is simple: I highly value loyalty, honest conversations, and traditional coffee ceremonies with friends.',
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&auto=format&fit=crop&q=80',
    status: 'Online',
    relationshipIntent: 'True Relationship',
    interests: ['Coffee Ceremony', 'Family Values', 'Laughter', 'Classical Music'],
    verified: true,
    contactInfo: {
      phone: '+251 912 404 505',
      telegram: '@eden_girma',
      instagram: '@eden_girma',
      email: 'eden@example.com'
    }
  },
  {
    id: 'p16',
    name: 'Bereket Kebede',
    age: 30,
    city: 'Adama',
    bio: 'Civil engineer. Designing connections is my daytime profession, finding a beautiful life companion is my ultimate dream.',
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80',
    status: 'Online',
    relationshipIntent: 'True Relationship',
    interests: ['Road Trips', 'Cultural Music', 'Civil Design', 'Family First'],
    verified: true,
    contactInfo: {
      phone: '+251 916 220 330',
      telegram: '@bereket_k',
      instagram: '@bereket_kebede',
      email: 'bereket@example.com'
    }
  }
];

export const INITIAL_SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 's1',
    coupleNames: 'Selam & Dawit',
    story: 'We met on Whaatachi in late 2024. After chatting for two weeks about our mutual interest in architecture and Addis Ababa cafe culture, we met up for a traditional coffee date at Tomoca in Bole. Fast forward to today, we are engaged to be married in December!',
    year: '2025',
    image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 's2',
    coupleNames: 'Hana & Michael',
    story: 'I was skeptical about online dating in Ethiopia at first, but Whaatachi felt secure because of the payment moderation. Michael verified his profile using his Telebirr payment and reached out to me. We connected instantly over our love for volunteer work.',
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
    content: `Dating in Ethiopia has traditionally been built on community connections and introductions through mutual friends. However, in the modern era of fast-paced cities like Addis Ababa, Adama, and Hawassa, young professionals are increasingly turning to dedicated platforms to find meaningful relationships.

### The Power of Online Safety
In the digital space, safety remains the highest concern. This is why trusted identity verification is paramount. When entering online dating:
- **Always look for Verified Badges**: Verification ensures the other user is committed.
- **First Dates in Public Places**: Opt for well-known cafes like Tomoca, Garden of Pizza, or traditional Habesha restaurants.
- **Keep contact unlocking respectful**: Only unlock contacts of matches whose profiles genuinely resonate with you.`
  },
  {
    id: 'a2',
    title: 'Staying Safe While Connecting Online',
    excerpt: 'Essential digital safety tips tailored specifically for dating platforms in metropolitan Ethiopian cities.',
    category: 'Safety First',
    readTime: '4 min read',
    date: 'May 28, 2026',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
    content: 'Connecting with people online is exciting, but it must be coupled with street-smart digital hygiene. Never share your direct Bank Account or Telebirr PIN with anyone calling you from the platform. Authentic admins will NEVER ask for your temporary OTP or security keys.'
  },
  {
    id: 'a3',
    title: 'The Perfect Initial Habesha Coffee Date Checklist',
    excerpt: 'Simple, low-pressure steps to transition your digital chat into a comfortable, cultural real-life meeting.',
    category: 'Dating Tips',
    readTime: '5 min read',
    date: 'April 12, 2026',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    content: 'Taking the conversation off-screen is a major step. Keep it casual! A low-pressure afternoon macchiato is far better than a heavy formal dinner. Give each other space, respect boundaries, and focus on laughing together.'
  }
];

export const FAQS = [
  {
    category: 'Payments & Subscriptions',
    items: [
      {
        question: 'Why is there a payment for men but not women?',
        answer: 'To ensure a high safety ratio, reduce spam accounts, and filter for genuine gentlemen who are serious about finding real relationships. This tiny 200 Birr fee acts as a quality verification barrier, making our workspace extremely pleasant and safe for everyone.'
      },
      {
        question: 'What are the accepted payment methods?',
        answer: 'We securely accept Telebirr and CBE Birr. In the Payment portal, copy our merchant account details, send the payment, and copy-paste your Transaction ID for lightning-fast verification.'
      },
      {
        question: 'How long does the payment verification take?',
        answer: 'Our mod team reviews submissions 24/7. Typically, your account gets verified and activated in less than 15-30 minutes of transaction submission. You will see a tracker on your submission log.'
      }
    ]
  },
  {
    category: 'Profile & Verification',
    items: [
      {
        question: 'What does the Verified badge signify?',
        answer: 'It represents that the user\'s identity or payment context has been approved by our admin moderation desk, confirming they are a real person physically located in Ethiopia.'
      },
      {
        question: 'Can I change my location and intent settings?',
        answer: 'Yes! Simply navigate to "My Profile" tab in your dashboard sidebar to update your current city, intent, age, and interests instantly.'
      }
    ]
  },
  {
    category: 'Messaging & Discovery',
    items: [
      {
        question: 'How does Contact Unlocking work?',
        answer: 'Once you hit "Unlock Contact", you will be shown our payment modal. After submitting proof of payment, the profile owner is notified and their direct Habesha Telegram/Phone digits are made visible in your "Unlock History" tab permanently.'
      },
      {
        question: 'Is my personal data safe with Whaatachi?',
        answer: 'Absolutely. Your phone and Telegram credentials are encrypted and strictly guarded. They are ONLY revealed to verified candidates whom you choose to unlock or who unlock you under complete security.'
      }
    ]
  }
];

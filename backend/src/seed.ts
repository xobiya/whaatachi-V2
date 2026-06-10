import dotenv from 'dotenv';
dotenv.config();

import { initDatabase } from './config/schema';
import * as userModel from './models/user.model';
import * as storyModel from './models/story.model';
import * as articleModel from './models/article.model';
import * as faqModel from './models/faq.model';
import { v4 as uuid } from 'uuid';

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
const INTENTS: ('True Relationship' | 'Friendship' | 'Friends with Benefits' | 'Only Sex')[] = ['True Relationship', 'Friendship', 'Friends with Benefits', 'Only Sex'];
const INTERESTS_POOL = [
  'Coffee Ceremony', 'Macchiato', 'Technology', 'Literature', 'Jazz', 'Hiking',
  'Photography', 'Art Galleries', 'Traditional Food', 'Fitness', 'Philosophy',
  'Business', 'Road Trips', 'Tennis', 'Volunteering', 'History',
  'Cooking', 'Content Creation', 'Bole Cafes', 'Design',
  'Lake Walks', 'Acoustic Music', 'Family Values', 'Travel',
  'Music', 'Dancing', 'Reading', 'Movies', 'Fashion', 'Sports',
];
const STATUSES: ('Online' | 'Offline' | 'Recently Active')[] = ['Online', 'Offline', 'Recently Active'];

const femaleNames = [
  'Selamawit Tekle', 'Kidist Hailu', 'Helen Gebru', 'Bethel Elias',
  'Hana Kassa', 'Martha Tesfaye', 'Tigist Alene', 'Eden Girma',
  'Meron Alemu', 'Tsion Wondimu', 'Birtukan Desta', 'Mahlet Ayele',
  'Frehiwot Eshetu', 'Ruth Getachew', 'Sosina Tadesse', 'Likina Amare',
  'Bethlehem Assefa', 'Mekdes Hailu', 'Yordanos Mengistu', 'Hiwot Belay',
];

const maleNames = [
  'Abel Mekonnen', 'Daniel Tadesse', 'Nahom Girma', 'Samuel Solomon',
  'Elias Shiferaw', 'Yohannes Bekele', 'Michael Tsegaye', 'Bereket Kebede',
  'Dawit Haile', 'Henok Tesfaye', 'Binyam Alemu', 'Yonas Gebre',
  'Ermias Wondimu', 'Mikiyas Tadesse', 'Nebiyu Fekadu', 'Kalkidan Hailu',
  'Biruk Assefa', 'Surafel Girma', 'Natnael Abebe', 'Yared Getachew',
];

const additionalFemaleNames = [
  'Bethelihem Alemu', 'Tsion Abate', 'Freweyni Assefa', 'Meklit Worku', 'Selam Teshome',
  'Eyerusalem Shiferaw', 'Lensa Tadesse', 'Yeabsira Nigussie', 'Edlawit Mulugeta', 'Bontu Olani',
];

const additionalMaleNames = [
  'Abenezer Wondimu', 'Yonatan Ayele', 'Natnael Kebede', 'Kidus Mesfin', 'Bemnet Tefera',
  'Eyosias Shibabaw', 'Mintesinot Ayele', 'Yisehak Tesfaye', 'Robel Abate', 'Liyu Birhane',
];

const femaleBios = [
  'I love exploring new cafes in Addis and meeting genuine people. Looking for someone who values real connection.',
  'Passionate about my career and culture. Looking for a true gentleman who respects traditions.',
  'Coffee lover, book enthusiast, and weekend hiker. Let\'s share stories over macchiato.',
  'Family-oriented professional looking for a serious relationship built on trust and respect.',
  'Adventurous spirit who loves traveling across Ethiopia\'s beautiful landscapes. Seeking a partner in crime.',
  'Creative soul who enjoys art, music, and deep conversations. Let\'s explore Bole together.',
  'Faith-driven woman looking for a God-fearing man for a lasting relationship.',
  'Foodie who loves traditional Ethiopian cuisine and trying new restaurants. Looking for someone to share meals with.',
  'Yoga enthusiast and wellness coach. Seeking a balanced, healthy relationship.',
  'Dedicated professional who also values quality time with family. Looking for my missing piece.',
];

const maleBios = [
  'Hardworking professional looking for a genuine connection. I appreciate honesty and good conversation over coffee.',
  'Entrepreneur by day, music lover by night. Seeking a smart, kind woman to share life with.',
  'Sports enthusiast and fitness lover. Looking for someone who values health and happiness.',
  'Engineer with a passion for travel and photography. Let\'s explore Ethiopia together.',
  'Family man at heart. Looking for a serious relationship that leads to marriage.',
  'Creative professional who enjoys art galleries, live music, and Ethiopian cuisine.',
  'Ambitious and driven, but know how to relax. Looking for a partner who balances work and life.',
  'Simple guy who values loyalty, respect, and good vibes. Let\'s start with coffee and see where it goes.',
  'Tech startup founder who also loves traditional coffee ceremonies. Seeking a genuine connection.',
  'Adventure seeker who loves road trips to Lalibela and the Northern Mountains. Join me!',
];

const biDirectFemale = [
  'No strings attached. Just two adults who know what they want. Discretion guaranteed.',
  'Looking for a real connection, not games. Let\'s build something meaningful together.',
  'Straightforward — I want a genuine relationship with a man who respects me.',
  'Over the fake romances. I\'m here for something real, open, and passionate.',
  'Physical chemistry matters. Let\'s meet if we vibe and keep it honest.',
  'Hoping to find my future husband. Family-oriented woman with traditional values.',
  'I know what I want and I\'m not shy about it. Honesty and passion first.',
  'Looking for a serious partner to share life, coffee, and sunsets with.',
  'Let\'s keep it simple and hot. Mutual respect and good energy required.',
  'Faithful woman seeking a loyal man for a lasting relationship. Let\'s start with a walk.',
];

const biDirectMale = [
  'I don\'t waste time. If you\'re direct and know what you want, let\'s talk.',
  'Looking for a serious woman to settle down with. Old school values, modern mind.',
  'Let\'s be honest — physical connection is important. Let\'s see if we click.',
  'Ready for marriage. Looking for a woman who values family, faith, and loyalty.',
  'No drama, no games. Just good vibes and real physical connection.',
  'Seeking a queen to build a future with. Ambitious, respectful, and romantic.',
  'I\'m upfront about what I want — passionate encounters with no complications.',
  'Traditional guy with a big heart. Looking for my partner for life.',
  'Into fitness and having fun. Not looking for a girlfriend — looking for a good time.',
  'God-fearing man seeking a wife. Let\'s build a beautiful future together.',
];

function pickAt<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

function pickN<T>(arr: T[], startIndex: number, count: number): T[] {
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    result.push(arr[(startIndex + i) % arr.length]);
  }
  return result;
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s/g, '');
}

async function seed(): Promise<void> {
  try {
    await initDatabase();

    const force = process.argv.includes('--force');
    if (force) {
      const { query } = await import('./config/database');
      await query('DELETE FROM payments');
      await query('DELETE FROM success_stories');
      await query('DELETE FROM articles');
      await query('DELETE FROM faqs');
      await query('DELETE FROM users');
      console.log('Cleared existing data.');
    } else {
      const existing = await userModel.countUsers();
      if (existing > 0) {
        console.log('Database already has data. Skipping seed.');
        console.log('Use --force to re-seed.');
        process.exit(0);
      }
    }

    // ── Seed 20 Female Profiles ──
    for (let i = 0; i < femaleNames.length; i++) {
      const name = femaleNames[i];
      const parts = name.split(' ');
      await userModel.createUser({
        id: uuid(),
        name,
        age: 21 + (i % 12),
        city: pickAt(CITIES, i),
        address: '',
        bio: pickAt(femaleBios, i),
        gender: 'Female',
        lookingFor: 'Male',
        image: pickAt(FEMALE_IMAGES, i),
        status: pickAt(STATUSES, i),
        relationshipIntent: pickAt(INTENTS, i),
        interests: JSON.stringify(pickN(INTERESTS_POOL, i * 3, 3)),
        phone: `+251 91${String(1000000 + i * 123456).slice(0, 7)}`,
        telegram: `@${parts[0].toLowerCase()}_${i}`,
        instagram: `@${parts[0].toLowerCase()}_eth`,
        email: `${slugify(name)}@whaatachi.com`,
      });
    }

    // ── Seed 20 Male Profiles ──
    for (let i = 0; i < maleNames.length; i++) {
      const name = maleNames[i];
      const parts = name.split(' ');
      await userModel.createUser({
        id: uuid(),
        name,
        age: 22 + (i % 14),
        city: pickAt(CITIES, i + 5),
        address: '',
        bio: pickAt(maleBios, i),
        gender: 'Male',
        lookingFor: 'Female',
        image: pickAt(MALE_IMAGES, i),
        status: pickAt(STATUSES, i + 2),
        relationshipIntent: pickAt(INTENTS, i),
        interests: JSON.stringify(pickN(INTERESTS_POOL, i * 3 + 1, 3)),
        phone: `+251 91${String(2000000 + i * 123456).slice(0, 7)}`,
        telegram: `@${parts[0].toLowerCase()}_${i}`,
        instagram: `@${parts[0].toLowerCase()}_eth`,
        email: `${slugify(name)}@whaatachi.com`,
      });
    }

    // ── Seed 10 Additional Female (5 Only Sex, 5 True Relationship) ──
    for (let i = 0; i < additionalFemaleNames.length; i++) {
      const name = additionalFemaleNames[i];
      const intent: 'Only Sex' | 'True Relationship' = i < 5 ? 'Only Sex' : 'True Relationship';
      const parts = name.split(' ');
      await userModel.createUser({
        id: uuid(),
        name,
        age: 20 + (i % 10),
        city: pickAt(CITIES, i + 3),
        address: '',
        bio: biDirectFemale[i],
        gender: 'Female',
        lookingFor: 'Male',
        image: pickAt(FEMALE_IMAGES, i),
        status: pickAt(STATUSES, i + 1),
        relationshipIntent: intent,
        interests: JSON.stringify(pickN(INTERESTS_POOL, i * 2 + 10, 3)),
        phone: `+251 91${String(3000000 + i * 123456).slice(0, 7)}`,
        telegram: `@${parts[0].toLowerCase()}_${i}`,
        instagram: `@${parts[0].toLowerCase()}_eth`,
        email: `${slugify(name)}@whaatachi.com`,
      });
    }

    // ── Seed 10 Additional Male (5 Only Sex, 5 True Relationship) ──
    for (let i = 0; i < additionalMaleNames.length; i++) {
      const name = additionalMaleNames[i];
      const intent: 'Only Sex' | 'True Relationship' = i < 5 ? 'Only Sex' : 'True Relationship';
      const parts = name.split(' ');
      await userModel.createUser({
        id: uuid(),
        name,
        age: 22 + (i % 12),
        city: pickAt(CITIES, i + 7),
        address: '',
        bio: biDirectMale[i],
        gender: 'Male',
        lookingFor: 'Female',
        image: pickAt(MALE_IMAGES, i + 3),
        status: pickAt(STATUSES, i),
        relationshipIntent: intent,
        interests: JSON.stringify(pickN(INTERESTS_POOL, i * 2 + 20, 3)),
        phone: `+251 91${String(4000000 + i * 123456).slice(0, 7)}`,
        telegram: `@${parts[0].toLowerCase()}_${i}`,
        instagram: `@${parts[0].toLowerCase()}_eth`,
        email: `${slugify(name)}@whaatachi.com`,
      });
    }

    console.log('Seeded 60 users (20 female, 20 male, 10 additional female, 10 additional male).');

    // ── Seed Success Stories ──
    const stories = [
      { coupleNames: 'Selam & Dawit', story: 'We met on Whaatachi in late 2024. After chatting for two weeks about architecture and Addis cafe culture, we met for coffee at Tomoca in Bole. Now we are engaged!', year: '2025', image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80' },
      { coupleNames: 'Hana & Michael', story: 'I was skeptical about online dating in Ethiopia, but Whaatachi felt secure. Michael verified his profile through Telebirr payment and reached out. We connected over volunteer work and now we are planning our wedding!', year: '2024', image: 'https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?w=600&auto=format&fit=crop&q=80' },
      { coupleNames: 'Meron & Abel', story: 'The verification process made me feel safe. We both had our profiles verified and it made all the difference. Now we are a happy couple living in Bole.', year: '2024', image: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&auto=format&fit=crop&q=80' },
    ];
    for (const s of stories) {
      await storyModel.createStory({ id: uuid(), ...s });
    }
    console.log('Seeded 3 success stories.');

    // ── Seed Articles ──
    const articles = [
      {
        title: 'The Modern Ethiopian Guide to Digital Courtship',
        excerpt: 'Dating in Ethiopia is shifting towards digital spaces. Learn how to navigate text etiquette, secure verification, and the transition from app to initial coffee dates.',
        category: 'Relationship Guide',
        readTime: '6 min read',
        date: 'June 5, 2026',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
        content: 'Dating in Ethiopia has traditionally been built on community connections. However, in the modern era of fast-paced cities like Addis Ababa, young professionals are increasingly turning to dedicated platforms to find meaningful relationships.',
      },
      {
        title: 'Staying Safe While Connecting Online',
        excerpt: 'Essential digital safety tips tailored for dating platforms in Ethiopian cities.',
        category: 'Safety First',
        readTime: '4 min read',
        date: 'May 28, 2026',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
        content: 'Never share your bank account or Telebirr PIN with anyone. Authentic admins will never ask for your OTP or security keys. Always verify through the platform\'s official channels.',
      },
      {
        title: 'The Perfect Initial Habesha Coffee Date Checklist',
        excerpt: 'Simple, low-pressure steps to transition your digital chat into a comfortable real-life meeting.',
        category: 'Dating Tips',
        readTime: '5 min read',
        date: 'April 12, 2026',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
        content: 'Keep it casual! A low-pressure afternoon macchiato is far better than a formal dinner. Respect boundaries and focus on laughing together. Choose a public, well-known cafe in Bole or Piassa for your first meeting.',
      },
    ];
    for (const a of articles) {
      await articleModel.createArticle({ id: uuid(), ...a });
    }
    console.log('Seeded 3 articles.');

    // ── Seed FAQs ──
    const faqData = [
      { category: 'Payments & Subscriptions', question: 'Why is there a payment for men but not women?', answer: 'To ensure a high safety ratio, reduce spam, and filter for genuine gentlemen. The 200 Birr fee acts as a quality barrier, making our platform safe for everyone.', sortOrder: 1 },
      { category: 'Payments & Subscriptions', question: 'What payment methods are accepted?', answer: 'We accept Telebirr and CBE Birr. Copy our merchant account details, send the payment, and paste your Transaction ID for verification.', sortOrder: 2 },
      { category: 'Payments & Subscriptions', question: 'How long does verification take?', answer: 'Our team reviews submissions 24/7. Accounts are typically verified within 15-30 minutes.', sortOrder: 3 },
      { category: 'Profile & Verification', question: 'What does the Verified badge mean?', answer: 'It means the user has been approved by our admin team as a real person physically located in Ethiopia.', sortOrder: 4 },
      { category: 'Profile & Verification', question: 'Can I change my location and intent?', answer: 'Yes! Go to your profile dashboard to update your city, intent, age, and interests.', sortOrder: 5 },
      { category: 'Messaging & Discovery', question: 'How does Contact Unlocking work?', answer: 'Click "Unlock Contact", submit payment proof, and the profile\'s phone, Telegram, and Instagram appear in your Unlock History permanently.', sortOrder: 6 },
      { category: 'Messaging & Discovery', question: 'Is my data safe?', answer: 'Absolutely. Your phone and Telegram are encrypted. They are only revealed to verified members you choose to unlock.', sortOrder: 7 },
    ];
    for (const f of faqData) {
      await faqModel.createFaq({ id: uuid(), ...f });
    }
    console.log('Seeded 7 FAQs.');

    console.log('Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();

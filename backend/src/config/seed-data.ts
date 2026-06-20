import { v4 as uuid } from 'uuid';
import { query, scalar } from '../lib/db';

const FEMALE_IMAGES = [
  '/assets/One.avif', '/assets/two.avif', '/assets/three.avif', '/assets/four.avif',
  '/assets/One.avif', '/assets/two.avif', '/assets/three.avif', '/assets/four.avif',
  '/assets/One.avif', '/assets/two.avif',
];

const MALE_IMAGES = [
  '/assets/1.avif', '/assets/2.avif', '/assets/3.avif',
  '/assets/1.avif', '/assets/2.avif', '/assets/3.avif',
  '/assets/1.avif', '/assets/2.avif', '/assets/3.avif',
  '/assets/1.avif',
];

const CITIES = ['Addis Ababa', 'Adama', 'Hawassa', 'Bahir Dar', 'Dire Dawa', 'Gondar', 'Mekelle', 'Jimma', 'Dessie', 'Harar'];
const INTENTS: string[] = ['True Relationship', 'Friendship', 'Friends with Benefits', 'Only Sex'];
const INTERESTS_POOL = [
  'Coffee Ceremony', 'Macchiato', 'Technology', 'Literature', 'Jazz', 'Hiking',
  'Photography', 'Art Galleries', 'Traditional Food', 'Fitness', 'Philosophy',
  'Business', 'Road Trips', 'Tennis', 'Volunteering', 'History',
  'Cooking', 'Content Creation', 'Bole Cafes', 'Design',
  'Lake Walks', 'Acoustic Music', 'Family Values', 'Travel',
  'Music', 'Dancing', 'Reading', 'Movies', 'Fashion', 'Sports',
];
const STATUSES = ['Online', 'Offline', 'Recently Active'];

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

export async function seedData(clearFirst = false, force = false) {
  if (clearFirst) {
    await query('DELETE FROM Payment');
    await query('DELETE FROM UserInterest');
    await query('DELETE FROM User');
    console.log('[seeder] Cleared existing data.');
  }

  const userCount = await scalar('SELECT COUNT(*) as cnt FROM User');

  if (userCount === 0 || force) {
    console.log(`[seeder] Starting execution. Current user count: ${userCount}`);

    async function buildUser(i, name, gender, bioPool, imgPool, phoneBase, lookingFor, intentOverride) {
      const parts = name.split(' ');
      const id = uuid();
      const interests = pickN(INTERESTS_POOL, i * 3 + (gender === 'Female' ? 0 : 1), 3);
      const phoneNum = `+25191${String(phoneBase + i * 123456).slice(0, 7)}`;
      const age = gender === 'Female' ? 21 + (i % 12) : 22 + (i % 14);

      try {
        await query(
          `INSERT INTO User (id, name, age, city, address, bio, gender, lookingFor, image, status, relationshipIntent, phone, telegram, instagram, email)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name=name`,
          [
            id, name, age, pickAt(CITIES, i + (gender === 'Female' ? 0 : 5)),
            '', pickAt(bioPool, i), gender, lookingFor, pickAt(imgPool, i),
            pickAt(STATUSES, i + (gender === 'Female' ? 0 : 2)),
            intentOverride || pickAt(INTENTS, i), phoneNum,
            `@${parts[0].toLowerCase()}_${i}`, `@${slugify(name)}`,
            `${slugify(name)}@whaatachi.com`,
          ]
        );

        const placeholders = interests.map(() => '(?, ?)').join(', ');
        const flat = [];
        for (const interest of interests) {
          flat.push(id, interest);
        }
        await query(
          `INSERT IGNORE INTO UserInterest (userId, interest) VALUES ${placeholders}`,
          flat
        );
      } catch (err) {
        console.error(`[seeder] Error inserting user ${name}:`, err.message);
      }
    }

    // Wrap in closures so they do not execute instantly
    const femaleSeeders = femaleNames.map((name, i) => () => buildUser(i, name, 'Female', femaleBios, FEMALE_IMAGES, 1e6, 'Male'));
    const maleSeeders = maleNames.map((name, i) => () => buildUser(i, name, 'Male', maleBios, MALE_IMAGES, 2e6, 'Female'));
    const addFemaleSeeders = additionalFemaleNames.map((name, i) => () => buildUser(i, name, 'Female', biDirectFemale, FEMALE_IMAGES, 3e6, 'Male', i < 5 ? 'Only Sex' : 'True Relationship'));
    const addMaleSeeders = additionalMaleNames.map((name, i) => () => buildUser(i, name, 'Male', biDirectMale, MALE_IMAGES, 4e6, 'Female', i < 5 ? 'Only Sex' : 'True Relationship'));

    const allTasks = [...femaleSeeders, ...maleSeeders, ...addFemaleSeeders, ...addMaleSeeders];

    // Execute in chunks of 4 (well within connectionLimit = 10)
    for (let i = 0; i < allTasks.length; i += 4) {
      const batch = allTasks.slice(i, i + 4).map(task => task());
      await Promise.all(batch);
    }

    console.log('[seeder] Seeded users configuration complete.');
  }
  console.log('[seeder] Seed runtime script complete!');
}

export type GradeLevel = 'Grade 7' | 'Grade 8' | 'Grade 9' | 'Grade 10';
export type SeasonSchedule = 'summer' | 'winter';
export type AnnouncementCategory = 'All' | 'Schedule' | 'Holiday' | 'Academic';

export interface FacultyContact {
  name: string;
  role: string;
  grade: string;
  block: string;
  phone: string;
  email: string;
  officeHours: string;
}

export interface ClassPeriod {
  period: string;
  summerTime: string;
  winterTime: string;
  subject: string;
  room: string;
  instructor: string;
}

export interface AnnouncementItem {
  id: string;
  date: string;
  title: string;
  category: Exclude<AnnouncementCategory, 'All'>;
  summary: string;
}

export interface SchoolPhoto {
  id: string;
  src: string;
  title: string;
  caption: string;
}

export interface AboutSectionTab {
  id: 'block-d' | 'introduction' | 'facilities' | 'achievements';
  label: string;
  heading: string;
  paragraphs: string[];
  highlights?: string[];
}

export const SCHOOL_INFO = {
  shortName: 'NIGHTINGALE',
  fullName: 'Nightingale International Secondary School',
  motto: 'Labore et Honore',
  blockName: 'Block D',
  blockSubtitle: 'Welcome to Block-D',
  blockGradeRange: 'Grades 7 to 10',
  address: 'Kopundole, Lalitpur, Nepal',
  mainPhones: ['015435663', '015430743'],
  blockDPhone: '01-5451791',
  email: 'school@nightingale.edu.np',
  establishedNote: 'More than 30 years of educational excellence',
  facebookUrl: 'https://www.facebook.com/theNightingaleSchool?mibextid=LQQJ4d',
  youtubeUrl: 'https://www.youtube.com/@nightingaleinternationalse5625',
  logoSrc: '/images/school/logo.png',
  heroCampusSrc: '/images/school/facility_1.png',
};

export const BLOCK_D_FACULTY: FacultyContact[] = [
  {
    name: 'T.L. Chaudhary',
    role: 'Founder Principal',
    grade: 'Institutional Leadership',
    block: 'Main Campus',
    phone: '015435663',
    email: 'school@nightingale.edu.np',
    officeHours: 'Sun – Fri · 9:30 AM – 4:00 PM',
  },
  {
    name: 'Ranjana Pradhan',
    role: 'Principal',
    grade: 'Academic Administration',
    block: 'Main Campus',
    phone: '015435663',
    email: 'school@nightingale.edu.np',
    officeHours: 'Sun – Fri · 9:30 AM – 3:45 PM',
  },
  {
    name: 'Deepa Thapa',
    role: 'Incharge',
    grade: 'Grades 9 & 10',
    block: 'Block D',
    phone: '01-5451791',
    email: 'school@nightingale.edu.np',
    officeHours: 'Sun – Fri · 9:30 AM – 3:45 PM',
  },
  {
    name: 'Meena Ale',
    role: 'Incharge',
    grade: 'Grade 8',
    block: 'Block D',
    phone: '01-5451791',
    email: 'school@nightingale.edu.np',
    officeHours: 'Sun – Fri · 9:30 AM – 3:45 PM',
  },
  {
    name: 'Amandeep Kaur',
    role: 'Incharge',
    grade: 'Grade 7',
    block: 'Block D',
    phone: '01-5451791',
    email: 'school@nightingale.edu.np',
    officeHours: 'Sun – Fri · 9:30 AM – 3:45 PM',
  },
];

export const OFFICIAL_TIMINGS = {
  summer: {
    label: 'Summer Schedule (Effective 18 Magh)',
    blockDDismissal: '3:45 PM',
    blockCDismissal: '3:30 PM',
    blockBDismissal: '3:15 PM',
    busShift1: '3:00 PM',
    busShift2: '4:00 PM',
    eveningExtraClass: '5:30 PM',
  },
  winter: {
    label: 'Winter Schedule',
    blockDDismissal: '3:15 PM',
    blockCDismissal: '3:00 PM',
    blockBDismissal: '2:45 PM',
    busShift1: '2:30 PM',
    busShift2: '3:30 PM',
    eveningExtraClass: '4:45 PM',
  },
};

export const GRADE_SCHEDULES: Record<GradeLevel, ClassPeriod[]> = {
  'Grade 7': [
    { period: 'Assembly', summerTime: '09:30 – 09:45', winterTime: '09:45 – 10:00', subject: 'Morning Assembly & Roll Call', room: 'Block D Courtyard', instructor: 'Amandeep Kaur (Incharge)' },
    { period: 'Period 1', summerTime: '09:45 – 10:30', winterTime: '10:00 – 10:40', subject: 'Compulsory Mathematics', room: 'Room D-101', instructor: 'Block D Mathematics Dept.' },
    { period: 'Period 2', summerTime: '10:30 – 11:15', winterTime: '10:40 – 11:20', subject: 'English Literature & Grammar', room: 'Room D-101', instructor: 'Block D English Dept.' },
    { period: 'Short Break', summerTime: '11:15 – 11:30', winterTime: '11:20 – 11:35', subject: 'Morning Refreshment Break', room: 'Campus Grounds', instructor: 'Duty Teachers' },
    { period: 'Period 3', summerTime: '11:30 – 12:15', winterTime: '11:35 – 12:15', subject: 'Science & Environment', room: 'Science Lab / D-101', instructor: 'Block D Science Dept.' },
    { period: 'Period 4', summerTime: '12:15 – 01:00', winterTime: '12:15 – 12:55', subject: 'Nepali', room: 'Room D-101', instructor: 'Block D Nepali Dept.' },
    { period: 'Lunch Break', summerTime: '01:00 – 01:35', winterTime: '12:55 – 01:25', subject: 'Midday Lunch & Recreation', room: 'Dining Hall', instructor: 'Duty Teachers' },
    { period: 'Period 5', summerTime: '01:35 – 02:20', winterTime: '01:25 – 02:05', subject: 'Social Studies & Population', room: 'Room D-101', instructor: 'Block D Humanities' },
    { period: 'Period 6', summerTime: '02:20 – 03:05', winterTime: '02:05 – 02:40', subject: 'Computer Science & Coding Lab', room: 'Ultra-Modern Computer Lab', instructor: 'IT Faculty' },
    { period: 'Period 7', summerTime: '03:05 – 03:45', winterTime: '02:40 – 03:15', subject: 'ECA: Sports, Debate, Music & Arts', room: 'Playground / Auditorium', instructor: 'ECA Coordinators' },
  ],
  'Grade 8': [
    { period: 'Assembly', summerTime: '09:30 – 09:45', winterTime: '09:45 – 10:00', subject: 'Morning Assembly & Roll Call', room: 'Block D Courtyard', instructor: 'Meena Ale (Incharge)' },
    { period: 'Period 1', summerTime: '09:45 – 10:30', winterTime: '10:00 – 10:40', subject: 'Science & Laboratory Practical', room: 'Physics / Chem Lab', instructor: 'Block D Science Dept.' },
    { period: 'Period 2', summerTime: '10:30 – 11:15', winterTime: '10:40 – 11:20', subject: 'Compulsory Mathematics', room: 'Room D-201', instructor: 'Block D Mathematics Dept.' },
    { period: 'Short Break', summerTime: '11:15 – 11:30', winterTime: '11:20 – 11:35', subject: 'Morning Refreshment Break', room: 'Campus Grounds', instructor: 'Duty Teachers' },
    { period: 'Period 3', summerTime: '11:30 – 12:15', winterTime: '11:35 – 12:15', subject: 'Optional Mathematics', room: 'Room D-201', instructor: 'Block D Mathematics Dept.' },
    { period: 'Period 4', summerTime: '12:15 – 01:00', winterTime: '12:15 – 12:55', subject: 'English', room: 'Room D-201', instructor: 'Block D English Dept.' },
    { period: 'Lunch Break', summerTime: '01:00 – 01:35', winterTime: '12:55 – 01:25', subject: 'Midday Lunch & Recreation', room: 'Dining Hall', instructor: 'Duty Teachers' },
    { period: 'Period 5', summerTime: '01:35 – 02:20', winterTime: '01:25 – 02:05', subject: 'Nepali', room: 'Room D-201', instructor: 'Block D Nepali Dept.' },
    { period: 'Period 6', summerTime: '02:20 – 03:05', winterTime: '02:05 – 02:40', subject: 'Social Studies', room: 'Room D-201', instructor: 'Block D Humanities' },
    { period: 'Period 7', summerTime: '03:05 – 03:45', winterTime: '02:40 – 03:15', subject: 'BLE Preparation & Robotics / ECA', room: 'Room D-201 / Lab', instructor: 'Meena Ale & Faculty' },
  ],
  'Grade 9': [
    { period: 'Assembly', summerTime: '09:30 – 09:45', winterTime: '09:45 – 10:00', subject: 'Morning Assembly & Briefing', room: 'Block D Courtyard', instructor: 'Deepa Thapa (Incharge)' },
    { period: 'Period 1', summerTime: '09:45 – 10:30', winterTime: '10:00 – 10:40', subject: 'Compulsory Mathematics', room: 'Room D-301', instructor: 'Secondary Math Faculty' },
    { period: 'Period 2', summerTime: '10:30 – 11:15', winterTime: '10:40 – 11:20', subject: 'Physics, Chemistry & Biology', room: 'Well-Equipped Science Labs', instructor: 'Secondary Science Faculty' },
    { period: 'Short Break', summerTime: '11:15 – 11:30', winterTime: '11:20 – 11:35', subject: 'Morning Refreshment Break', room: 'Campus Grounds', instructor: 'Duty Teachers' },
    { period: 'Period 3', summerTime: '11:30 – 12:15', winterTime: '11:35 – 12:15', subject: 'English', room: 'Room D-301', instructor: 'Secondary English Faculty' },
    { period: 'Period 4', summerTime: '12:15 – 01:00', winterTime: '12:15 – 12:55', subject: 'Optional Mathematics / Accountancy', room: 'Room D-301', instructor: 'Secondary Dept.' },
    { period: 'Lunch Break', summerTime: '01:00 – 01:35', winterTime: '12:55 – 01:25', subject: 'Midday Lunch & Library Access', room: 'Dining Hall / Library', instructor: 'Duty Teachers' },
    { period: 'Period 5', summerTime: '01:35 – 02:20', winterTime: '01:25 – 02:05', subject: 'Nepali', room: 'Room D-301', instructor: 'Secondary Nepali Faculty' },
    { period: 'Period 6', summerTime: '02:20 – 03:05', winterTime: '02:05 – 02:40', subject: 'Social Studies', room: 'Room D-301', instructor: 'Secondary Humanities' },
    { period: 'Period 7', summerTime: '03:05 – 03:45', winterTime: '02:40 – 03:15', subject: 'Computer Science / Health & Population', room: 'Computer Lab / D-301', instructor: 'Deepa Thapa & IT Dept.' },
  ],
  'Grade 10': [
    { period: 'Assembly', summerTime: '09:30 – 09:45', winterTime: '09:45 – 10:00', subject: 'Morning Assembly & SEE Briefing', room: 'Block D Courtyard', instructor: 'Deepa Thapa (Incharge)' },
    { period: 'Period 1', summerTime: '09:45 – 10:30', winterTime: '10:00 – 10:40', subject: 'Compulsory Mathematics (SEE Focus)', room: 'Room D-401', instructor: 'Senior Math Faculty' },
    { period: 'Period 2', summerTime: '10:30 – 11:15', winterTime: '10:40 – 11:20', subject: 'Science & Technology', room: 'Science Lab / D-401', instructor: 'Senior Science Faculty' },
    { period: 'Short Break', summerTime: '11:15 – 11:30', winterTime: '11:20 – 11:35', subject: 'Morning Refreshment Break', room: 'Campus Grounds', instructor: 'Duty Teachers' },
    { period: 'Period 3', summerTime: '11:30 – 12:15', winterTime: '11:35 – 12:15', subject: 'Optional Mathematics / Economics', room: 'Room D-401', instructor: 'Senior Dept.' },
    { period: 'Period 4', summerTime: '12:15 – 01:00', winterTime: '12:15 – 12:55', subject: 'English', room: 'Room D-401', instructor: 'Senior English Faculty' },
    { period: 'Lunch Break', summerTime: '01:00 – 01:35', winterTime: '12:55 – 01:25', subject: 'Midday Lunch & Reading Room', room: 'Dining Hall / Library', instructor: 'Duty Teachers' },
    { period: 'Period 5', summerTime: '01:35 – 02:20', winterTime: '01:25 – 02:05', subject: 'Nepali', room: 'Room D-401', instructor: 'Senior Nepali Faculty' },
    { period: 'Period 6', summerTime: '02:20 – 03:05', winterTime: '02:05 – 02:40', subject: 'Social Studies', room: 'Room D-401', instructor: 'Senior Humanities' },
    { period: 'Period 7', summerTime: '03:05 – 03:45', winterTime: '02:40 – 03:15', subject: 'Computer Science / SEE Model Test', room: 'Computer Lab / D-401', instructor: 'SEE Preparation Team' },
  ],
};

export const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'notice-1',
    date: 'Sep 26, 2026',
    title: 'Weather Closure & Class Resumption Notice',
    category: 'Schedule',
    summary:
      'The school was previously scheduled to remain open on 11th Asoj 2083 (Sunday). However, due to unfavorable weather conditions, the school will remain closed on 11th Asoj 2083. Classes will resume from 12th Asoj 2083 (Monday) as usual.',
  },
  {
    id: 'notice-2',
    date: 'Sep 24, 2026',
    title: 'Indra Jatra Holiday & Second Terminal Exam Preparation',
    category: 'Academic',
    summary:
      'Nightingale School will remain closed on 9th Ashwin 2083 (Friday) on the occasion of Indra Jatra, as specified in the school calendar, and open on 11th Ashwin 2083 (Sunday) to facilitate preparation for the upcoming Second Terminal Examinations.',
  },
  {
    id: 'notice-3',
    date: 'Sep 16, 2026',
    title: 'SCHOLARSHIP 2083 B.S. — Nightingale International Secondary School, Kupandole',
    category: 'Academic',
    summary:
      'Merit and need-based scholarship applications open for deserving students at Nightingale International Secondary School, Kupandole, Lalitpur.',
  },
];

export const ABOUT_TABS: AboutSectionTab[] = [
  {
    id: 'block-d',
    label: 'Block D (Grades 7–10)',
    heading: 'Welcome to Block-D',
    paragraphs: [
      'This block runs classes from grade 7 to grade 10. This block stands as a testament to excellence in education, fostering a learning environment that goes beyond textbooks and classrooms.',
      'With a rich history and a commitment to academic brilliance, we have consistently produced outstanding results. Our dedicated team of experienced educators is passionate about nurturing the intellectual curiosity of our students, preparing them for a future of limitless possibilities.',
      'What sets us apart is not only our academic prowess but also our vibrant culture of extracurricular activities. Our students actively engage in a myriad of pursuits, from sports to arts, music to debate, ensuring a holistic development that extends far beyond academics. The hallmarks of leadership, teamwork, and creativity are instilled in every student who passes through our doors.',
      'As we celebrate more than 30 years of educational excellence, we continue to evolve, embracing innovation and modern teaching methodologies to prepare our students for the challenges of the 21st century. Join us on a journey of discovery, growth, and achievement as we inspire the leaders of tomorrow.',
    ],
  },
  {
    id: 'introduction',
    label: 'About Nightingale',
    heading: 'About Nightingale International School',
    paragraphs: [
      'Nightingale International Secondary School has no longer remained an unknown institute amidst the populace at large. Ever since her foundation was laid over two and a half decade ago, a great deal of endeavours have been made for making her stand out with unique academic environment and proven quality in education.',
      'Surrounded by pleasant and peaceful atmosphere, enriched by panoramic view of beautiful Bagmati river bank, this school offers her scholars incomparable academic infrastructure, well-stocked library, well-equipped science labs, ultra modern computer lab, and spacious play ground which are readily accessible to all her students.',
      'Inspired by the motto “LABORE ET HONORE”, all the school family members encourage the students and facilitate them for putting their utmost efforts on study. To impart high quality education catering to global needs at reasonable cost is the foremost intention of this institution.',
    ],
  },
  {
    id: 'facilities',
    label: 'Facilities & Support',
    heading: 'Academic Infrastructure, Sports & Student Support',
    paragraphs: [
      'Sports and recreational activities are an essential part of growth. Nightingale gives emphasis on both mental and physical development. Football, basketball, volleyball, table tennis, cricket, and badminton are the major sporting activities which refresh and energise the students.',
      'We believe students are the clay which can be moulded in any shape depending upon the skill of the artist. Hence, we are very much sensitive towards the psychological and social needs of the students, leaving no stone unturned for their overall personality growth.',
    ],
    highlights: [
      'Well-Stocked Library & Reading Room',
      'Well-Equipped Physics, Chemistry & Biology Labs',
      'Ultra-Modern Computer & Robotics Lab',
      'Spacious Playground (Football, Basketball, Cricket, Badminton)',
    ],
  },
  {
    id: 'achievements',
    label: 'Awards & Achievements',
    heading: 'National & International Recognition',
    paragraphs: [
      'In the S.L.C.–2061 B.S., students from this school secured 2nd and 3rd Board Toppers among girls and 6th and 7th position among all, earning the S.L.C. Excellence Award by Everest Foundation Nepal, followed by 1st Board Topper in 2062 B.S. and Education Award-2068.',
      'Nightingale has bagged the Aishwarya Shield in dance three times, won Gold Medal three times and Silver Medal two times at the National Level Spelling Contest, attained 2nd position at the National Level Science Exhibition, and stood 1st among 7,000 contestants at the International Art and Craft Competition.',
    ],
    highlights: [
      'Participation in FWWMUN, New York, USA',
      'Winner of SAAN Quiz Competition (Prashant Kumar Jaiswal)',
      'Young Scientists Summit in Russia (Abhinav Gauli)',
      'Honored with the International School Award & UK Partnership',
    ],
  },
];

export const SCHOOL_PHOTOS: SchoolPhoto[] = [
  {
    id: 'computer-lab',
    src: '/images/school/facility_4.jpg',
    title: 'Computer & Innovation Lab — Block D',
    caption: 'Secondary students in uniform working in the ultra-modern computer and coding laboratory.',
  },
  {
    id: 'facility-2',
    src: '/images/school/facility_2.png',
    title: 'Science & Academic Wing',
    caption: 'Dedicated classrooms and science laboratories supporting Grades 7 to 10.',
  },
  {
    id: 'facility-3',
    src: '/images/school/facility_3.png',
    title: 'Library & Study Resource Center',
    caption: 'Well-stocked library and quiet study spaces for BLE and SEE preparation.',
  },
  {
    id: 'campus-excursion',
    src: '/images/school/about_campus.jpeg',
    title: 'Student Leadership & Outdoor Learning',
    caption: 'Holistic extracurricular and educational excursions for Nightingale students.',
  },
];

export function getScheduleForGrade(
  grade: GradeLevel,
  season: SeasonSchedule
): Array<ClassPeriod & { activeTime: string }> {
  const periods = GRADE_SCHEDULES[grade] ?? GRADE_SCHEDULES['Grade 7'];
  return periods.map((p) => ({
    ...p,
    activeTime: season === 'summer' ? p.summerTime : p.winterTime,
  }));
}

export function filterAnnouncements(
  items: AnnouncementItem[],
  category: AnnouncementCategory,
  query: string
): AnnouncementItem[] {
  const q = query.trim().toLowerCase();
  return items.filter((item) => {
    const matchesCat = category === 'All' || item.category === category;
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.date.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });
}

export interface InquiryFormInput {
  studentName: string;
  parentPhone: string;
  gradeApplying: GradeLevel;
  message: string;
}

export function validateInquiryForm(input: InquiryFormInput): {
  valid: boolean;
  error?: string;
} {
  if (!input.studentName.trim() || input.studentName.trim().length < 2) {
    return { valid: false, error: 'Please enter the student full name.' };
  }
  const digits = input.parentPhone.replace(/\D/g, '');
  if (digits.length < 7) {
    return { valid: false, error: 'Please enter a valid contact phone number.' };
  }
  return { valid: true };
}

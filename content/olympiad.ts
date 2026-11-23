import type { L } from "@/lib/i18n";

// NDESC's Olympiad teams. One source for the About page cards, /olympiad-teams/ and each team page.
// Facts come from the club: the About page text, and "The NDESC Olympiad Teams" document (23 Nov 2026)
// for Team Interstellar and Team Terrestrial (history, mentors, members and achievements by year).
// Where that document and a published result disagreed, the published result was used (see the
// notes beside those items). Sections with no content yet stay empty and the pages leave them out.

export type Achievement = {
  /** Left out when the club did not give the year. */
  year?: string;
  competition: string;
  /** e.g. "Silver medal", "Honourable mention". Participation alone is not an achievement. */
  award: string;
  /** Student or team credit, only with their permission. */
  credit?: string;
  /** Link to an official result or news report. */
  source?: { label: string; url: string };
};

/** One year's team: its mentors, advisors and members. */
export type Cohort = {
  year: string;
  mentors: { name: string; role: string }[];
  advisors?: string[];
  members: string[];
};

export type OlympiadTeam = {
  slug: "interstellar" | "terrestrial" | "helix";
  name: string;
  /** The international Olympiad the team prepares for. */
  olympiad: { name: L; short: string };
  /** Field shown on the team's card and page. */
  discipline: L;
  newlyFormed?: boolean;
  overview: L;
  /** Club activities that build the team (from the About page). */
  preparation: L[];
  selection?: L;
  /** Newest first. */
  cohorts: Cohort[];
  achievements: Achievement[];
  milestones: { year: string; text: L }[];
  photos: { src: string; alt: L }[];
  resources: { title: L; url: string }[];
};

const prepCommon: L[] = [
  { en: "Weekly meetings and informative sessions.", bn: "সাপ্তাহিক সভা ও তথ্যভিত্তিক সেশন।" },
  { en: "Team selection tests held by the club, often with universities and research teams.", bn: "ক্লাবের নেওয়া দল বাছাই পরীক্ষা, প্রায়ই বিশ্ববিদ্যালয় ও গবেষণা দলের সঙ্গে মিলে।" },
  { en: "Guidance from experienced and award-winning mentors.", bn: "অভিজ্ঞ ও পুরস্কারজয়ী মেন্টরদের তত্ত্বাবধান।" },
];

// From "The NDESC Olympiad Teams" document: what the Interstellar and Terrestrial programmes include.
const prepDoc: L[] = [
  { en: "Regular classes and assignments covering the whole syllabus.", bn: "পুরো সিলেবাস জুড়ে নিয়মিত ক্লাস ও অ্যাসাইনমেন্ট।" },
  { en: "Frequent assessments, so every member keeps improving.", bn: "ঘন ঘন মূল্যায়ন, যাতে প্রত্যেক সদস্য উন্নতি করতে থাকে।" },
  { en: "Practical, hands-on training.", bn: "হাতে-কলমে ব্যবহারিক প্রশিক্ষণ।" },
];

const selectionFor = (syllabus: L): L => ({
  en: `Every year about 7 to 10 members are selected for the team through team selection tests (TSTs). Before the tests, the club holds at least two sessions to introduce NDESC members to the ${syllabus.en} syllabus.`,
  bn: `প্রতি বছর দল বাছাই পরীক্ষার (TST) মাধ্যমে দলে ৭ থেকে ১০ জনের মতো সদস্য নেওয়া হয়। পরীক্ষার আগে NDESC সদস্যদের ${syllabus.bn} সিলেবাসের সঙ্গে পরিচয় করাতে ক্লাব অন্তত দুটি সেশন আয়োজন করে।`,
});

const terrestrialAdvisors = ["Ahsanur Razee", "Arindom Saha", "Mohtasim Hafiz", "Iftekhar Hossain Iftee"];

const founded = {
  year: "2023",
  text: {
    en: "Team founded by Iftekhar Hossain Iftee with Dhrubo Hridraz, Ashraful Islam Mahi and Shah Ahmed Jubaer.",
    bn: "ইফতেখার হোসেন ইফতি, ধ্রুব হৃদরাজ, আশরাফুল ইসলাম মাহি ও শাহ আহমেদ জুবায়েরের হাতে দলটি প্রতিষ্ঠিত হয়।",
  },
};

export const olympiadTeams: OlympiadTeam[] = [
  {
    slug: "interstellar",
    name: "Team Interstellar",
    olympiad: { name: { en: "International Olympiad on Astronomy and Astrophysics", bn: "ইন্টারন্যাশনাল অলিম্পিয়াড অন অ্যাস্ট্রোনমি অ্যান্ড অ্যাস্ট্রোফিজিক্স" }, short: "IOAA" },
    discipline: { en: "Astronomy and astrophysics", bn: "জ্যোতির্বিজ্ঞান ও জ্যোতির্পদার্থবিজ্ঞান" },
    overview: {
      en: "Team Interstellar is NDESC's astronomy team. Guided by a mentor panel, its members prepare for the Bangladesh Olympiad on Astronomy and Astrophysics (BDOAA) and the International Olympiad on Astronomy and Astrophysics through regular sessions, assessments and practical training.",
      bn: "টিম ইন্টারস্টেলার NDESC-এর জ্যোতির্বিজ্ঞান দল। একটি মেন্টর প্যানেলের তত্ত্বাবধানে নিয়মিত সেশন, মূল্যায়ন ও হাতে-কলমে প্রশিক্ষণের মাধ্যমে এর সদস্যরা বাংলাদেশ অলিম্পিয়াড অন অ্যাস্ট্রোনমি অ্যান্ড অ্যাস্ট্রোফিজিক্স (BDOAA) এবং ইন্টারন্যাশনাল অলিম্পিয়াড অন অ্যাস্ট্রোনমি অ্যান্ড অ্যাস্ট্রোফিজিক্সের প্রস্তুতি নেয়।",
    },
    preparation: [
      ...prepDoc,
      prepCommon[1],
      { en: "Stargazing and solar observation with the club's own telescope.", bn: "ক্লাবের নিজস্ব টেলিস্কোপে তারা দেখা ও সূর্য পর্যবেক্ষণ।" },
    ],
    selection: selectionFor({ en: "Astronomy Olympiad", bn: "জ্যোতির্বিজ্ঞান অলিম্পিয়াডের" }),
    cohorts: [
      {
        year: "2026",
        mentors: [
          { name: "Jaber Ibner Taher", role: "PhD in Physics, NC State University; IOAA 2018" },
          { name: "Sheikh Hasin Abrar Alvi", role: "IOAA 2024" },
          { name: "Tasdik Ahmed Tonmay", role: "IOAA 2025 silver medallist" },
        ],
        members: ["Sajid Aman", "M Fahim Rahman", "Mohammed Abrar", "Md Fahim Foysal", "Tahmid Jahan Iram", "Tawsif Muttaky", "Radi Amamul"],
      },
      {
        year: "2025",
        mentors: [
          { name: "Jaber Ibner Taher", role: "PhD in Physics, NC State University; IOAA 2018" },
          { name: "Sheikh Hasin Abrar Alvi", role: "IOAA 2024" },
        ],
        members: [
          "Tasdik Ahmed Tonmay", "Shaikh Taassuk Ahmed", "Junaed Labeeb Al Waasi", "Md. Shahriar Kabir", "Nirban Bin Shahjhan",
          "Sidratul Muntaha Masud", "Sadik Jafrullah Nabil", "Ishmum Mahdy Labeeb", "Mehrab Hasan", "Abhradeep Saha",
        ],
      },
      {
        year: "2024",
        mentors: [{ name: "Jaber Ibner Taher", role: "PhD in Physics, NC State University; IOAA 2018" }],
        members: ["Sheikh Hasin Abrar Alvi", "Labib Bin Azad", "Omor Bin Hayat", "Raiyan Kawsar", "Sheikh Fahim Mahmud", "Radh Chowdhury"],
      },
    ],
    achievements: [
      {
        year: "2026",
        competition: "Bangladesh Physics Olympiad (BDPhO) 2026",
        award: "Third place and national winner",
        credit: "Tasdik Ahmed Tonmay, Team Interstellar 2025",
      },
      {
        year: "2026",
        competition: "Bangladesh Physics Olympiad (BDPhO) 2026",
        award: "Regional winners",
        credit: "Several members of Team Interstellar 2025",
      },
      {
        year: "2025",
        competition: "International Olympiad on Astronomy and Astrophysics (IOAA) 2025",
        award: "Silver medal",
        // His IOAA 2024 bronze was won at Govt. Laboratory High School, Rajshahi, before he joined NDC
        // (The Daily Star, 31 Aug 2024), so it is mentioned in the credit rather than listed as the team's.
        credit: "Tasdik Ahmed Tonmay, Team Interstellar 2025 (he also won bronze at IOAA 2024, before joining NDESC)",
      },
      {
        year: "2025",
        competition: "BDOAA and BDAO 2025",
        award: "All 10 members national winners and campers, including first place in BDOAA",
        credit: "Team Interstellar 2025",
      },
      {
        year: "2025",
        competition: "Asian Physics Olympiad (APhO) 2025",
        award: "Honourable mention",
        credit: "Omor Bin Hayat, Team Interstellar 2024",
      },
      {
        year: "2024",
        competition: "International Olympiad on Astronomy and Astrophysics (IOAA) 2024",
        award: "Honourable mention",
        credit: "Labib Bin Azad, Team Interstellar 2024",
        source: { label: "The Daily Star", url: "https://www.thedailystar.net/node/3690826" },
      },
      {
        year: "2024",
        competition: "Bangladesh Olympiad on Astronomy and Astrophysics (BDOAA) 2024",
        award: "All 6 members national winners and campers",
        credit: "Team Interstellar 2024",
      },
    ],
    milestones: [
      {
        year: "2025",
        text: {
          en: "Tasdik Ahmed Tonmay represented Bangladesh at IOAA 2025, and Omor Bin Hayat represented Bangladesh at the Asian Physics Olympiad for the second year running.",
          bn: "তাসদিক আহমেদ তন্ময় IOAA 2025-এ এবং ওমর বিন হায়াত টানা দ্বিতীয় বছর এশিয়ান ফিজিক্স অলিম্পিয়াডে বাংলাদেশের প্রতিনিধিত্ব করে।",
        },
      },
      {
        year: "2024",
        text: {
          en: "Three members, Sheikh Hasin Abrar Alvi, Radh Chowdhury and Labib Bin Azad, represented Bangladesh at IOAA 2024. Omor Bin Hayat represented Bangladesh at the Asian Physics Olympiad 2024.",
          bn: "তিন সদস্য, শেখ হাসিন আবরার অলভি, রাধ চৌধুরী ও লাবিব বিন আজাদ, IOAA 2024-এ বাংলাদেশের প্রতিনিধিত্ব করে। ওমর বিন হায়াত এশিয়ান ফিজিক্স অলিম্পিয়াড 2024-এ বাংলাদেশের প্রতিনিধিত্ব করে।",
        },
      },
      founded,
    ],
    photos: [],
    resources: [],
  },
  {
    slug: "terrestrial",
    name: "Team Terrestrial",
    olympiad: { name: { en: "International Earth Science Olympiad", bn: "ইন্টারন্যাশনাল আর্থ সায়েন্স অলিম্পিয়াড" }, short: "IESO" },
    discipline: { en: "Earth science", bn: "ভূবিজ্ঞান" },
    overview: {
      en: "Team Terrestrial is NDESC's Earth science team. Guided by a mentor panel, its members prepare for the National Earth Olympiad (NEO) and the International Earth Science Olympiad through regular sessions, assessments and practical training.",
      bn: "টিম টেরেস্ট্রিয়াল NDESC-এর ভূবিজ্ঞান দল। একটি মেন্টর প্যানেলের তত্ত্বাবধানে নিয়মিত সেশন, মূল্যায়ন ও হাতে-কলমে প্রশিক্ষণের মাধ্যমে এর সদস্যরা ন্যাশনাল আর্থ অলিম্পিয়াড (NEO) এবং ইন্টারন্যাশনাল আর্থ সায়েন্স অলিম্পিয়াডের প্রস্তুতি নেয়।",
    },
    preparation: [...prepDoc, prepCommon[1]],
    selection: selectionFor({ en: "Earth Science Olympiad", bn: "আর্থ সায়েন্স অলিম্পিয়াডের" }),
    cohorts: [
      {
        year: "2026",
        mentors: [
          { name: "Ashraful Islam Mahi", role: "Founding mentor" },
          { name: "Sheikh Fahim Mahmud", role: "Chief mentor" },
          { name: "Abrar Nafis Sadeque", role: "Mentor" },
          { name: "Shaikh Taassuk Ahmed", role: "Mentor" },
        ],
        members: ["Shahad Shahriar", "Tawsif Muttaky", "Tawhidur Rahman", "M Rafat Chy", "Subrata Nabi", "Israk Tafhim", "Md. Omar Faruk"],
      },
      {
        year: "2025",
        mentors: [
          { name: "Ashraful Islam Mahi", role: "Founding mentor" },
          { name: "Sheikh Fahim Mahmud", role: "Chief mentor" },
          { name: "Abrar Nafis Sadeque", role: "Mentor" },
          { name: "Shaikh Taassuk Ahmed", role: "Mentor" },
        ],
        advisors: terrestrialAdvisors,
        members: ["Muhit Rahman", "Junaed Labeeb Al Waasi", "Md. Shahriar Kabir", "Tasdik Ahmed Tonmay", "Nirban Bin Shahjhan", "Sadik Jafrullah Nabil", "Zamiul Islam"],
      },
      {
        year: "2024",
        mentors: [{ name: "Ashraful Islam Mahi", role: "Founding mentor" }],
        advisors: terrestrialAdvisors,
        members: ["Sheikh Fahim Mahmud", "Sheikh Hasin Abrar Alvi", "Radh Chowdhury", "Raiyan Kawsar", "Omar Bin Arif", "Abrar Nafis Sadeque"],
      },
    ],
    achievements: [
      {
        year: "2025",
        competition: "International Earth Science Olympiad (IESO) 2025",
        award: "Bronze medal in the individual test (ITT) and an honourable mention",
        credit: "Sheikh Fahim Mahmud, Team Terrestrial 2024 and NDESC General Secretary",
        source: { label: "The Prestige", url: "https://theprestige.global/bangladesh-team-excels-clinching-5-medals-at-18th-ieso-in-china/" },
      },
      {
        year: "2024",
        competition: "National Earth Olympiad (NEO) 2024",
        award: "National winners and campers",
        credit: "Junaed Labeeb Al Waasi and Tasdik Ahmed Tonmay, Team Terrestrial 2025",
      },
      {
        year: "2023",
        competition: "International Earth Science Olympiad (IESO) 2023",
        award: "Gold in the International Team Field Investigation (ITFI), bronze in the Earth System Project (ESP) and bronze in the individual test (ITT)",
        credit: "Ashraful Islam Mahi, founding mentor",
      },
      {
        year: "2023",
        competition: "International Earth Science Olympiad (IESO) 2023",
        award: "Gold in the International Team Field Investigation (ITFI) and an honourable mention",
        credit: "Shaikh Taassuk Ahmed, Team Terrestrial mentor",
      },
      {
        // Year from Sheikh Hasin Abrar Alvi's own site (ICSO 2023); the club's document gives none.
        year: "2023",
        competition: "International Climate Science Olympiad",
        award: "Bronze medals",
        credit: "Sheikh Hasin Abrar Alvi and Raiyan Kawsar, Team Terrestrial 2024",
      },
      {
        competition: "National Earth Olympiad (NEO)",
        award: "Four divisional toppers reached the national round",
        credit: "Team Terrestrial 2025",
      },
      {
        competition: "Bangladesh Biology Olympiad (BDBO)",
        award: "National winner and camper",
        credit: "Sheikh Fahim Mahmud, Team Terrestrial 2024 and NDESC General Secretary",
      },
      {
        competition: "Bangladesh Biology Olympiad (BDBO)",
        award: "Regional champion",
        credit: "Md. Shahriar Kabir, Team Terrestrial 2025",
      },
    ],
    milestones: [
      {
        // The club's document also names Abrar Nafis Sadeque, but the published four-member team was
        // Mohammad Tahmid Rahman, Sheikh Fahim Mahmud, Omar Bin Arif and Faaris Ahmed Aayan (The Prestige).
        year: "2025",
        text: {
          en: "Sheikh Fahim Mahmud and Omar Bin Arif represented Bangladesh at IESO 2025.",
          bn: "শেখ ফাহিম মাহমুদ ও ওমর বিন আরিফ IESO 2025-এ বাংলাদেশের প্রতিনিধিত্ব করে।",
        },
      },
      founded,
    ],
    photos: [],
    resources: [],
  },
  {
    slug: "helix",
    name: "Team Helix",
    olympiad: { name: { en: "International Biology Olympiad", bn: "ইন্টারন্যাশনাল বায়োলজি অলিম্পিয়াড" }, short: "IBO" },
    discipline: { en: "Biology", bn: "জীববিজ্ঞান" },
    newlyFormed: true,
    overview: {
      en: "Team Helix is NDESC's newly formed biology team. Under the guidance of the club's mentors, its members prepare for the International Biology Olympiad.",
      bn: "টিম হেলিক্স NDESC-এর নতুন গড়া জীববিজ্ঞান দল। ক্লাবের মেন্টরদের তত্ত্বাবধানে এর সদস্যরা ইন্টারন্যাশনাল বায়োলজি অলিম্পিয়াডের প্রস্তুতি নেয়।",
    },
    preparation: prepCommon,
    cohorts: [],
    achievements: [],
    milestones: [],
    photos: [],
    resources: [],
  },
];

/** The shared intro used on About and /olympiad-teams/ (the club's own wording). */
export const olympiadIntro: L = {
  en: "NDESC also consists of its three renowned Olympiad teams. Under the guidance of experienced and award-winning mentors, team members prepare for these international Olympiads, achieving national and international recognition consistently every year.",
  bn: "NDESC-এর আছে তিনটি সুপরিচিত অলিম্পিয়াড দল। অভিজ্ঞ ও পুরস্কারজয়ী মেন্টরদের তত্ত্বাবধানে দলের সদস্যরা এই আন্তর্জাতিক অলিম্পিয়াডগুলোর প্রস্তুতি নেয়, আর প্রতি বছর ধারাবাহিকভাবে জাতীয় ও আন্তর্জাতিক স্বীকৃতি অর্জন করে।",
};

/** How Team Terrestrial and Team Interstellar began (from the club's document, lightly edited). */
export const olympiadHistory: L[] = [
  {
    en: "The teams were started by Iftekhar Hossain Iftee, who turned his own struggle with unstructured Olympiad preparation into a mission for the club. Iftee became a national winner in the National Earth Olympiad (NEO) and qualified for the International Earth Science Olympiad (IESO), but could not represent Bangladesh because of his HSC exams.",
    bn: "দলগুলো শুরু করেন ইফতেখার হোসেন ইফতি। অগোছালো অলিম্পিয়াড প্রস্তুতির নিজের অভিজ্ঞতাকে তিনি ক্লাবের একটি লক্ষ্যে পরিণত করেন। ইফতি ন্যাশনাল আর্থ অলিম্পিয়াডে (NEO) জাতীয় বিজয়ী হন এবং ইন্টারন্যাশনাল আর্থ সায়েন্স অলিম্পিয়াডে (IESO) জায়গা পান, কিন্তু HSC পরীক্ষার কারণে বাংলাদেশের প্রতিনিধিত্ব করতে পারেননি।",
  },
  {
    en: "So that future students would have the academic mentoring he lacked, he set up two dedicated teams in 2023 with Dhrubo Hridraz, Ashraful Islam Mahi and Shah Ahmed Jubaer. Team Terrestrial was formed to mentor candidates for the NEO, and Team Interstellar for the Bangladesh Olympiad on Astronomy and Astrophysics (BDOAA). Among the first teams in Bangladesh built specifically for the IESO and the IOAA, they have since led NDESC members to success at national and international level.",
    bn: "পরের শিক্ষার্থীরা যেন তাঁর না-পাওয়া একাডেমিক মেন্টরিং পায়, সে জন্য ২০২৩ সালে তিনি ধ্রুব হৃদরাজ, আশরাফুল ইসলাম মাহি ও শাহ আহমেদ জুবায়েরের সঙ্গে মিলে দুটি আলাদা দল গড়েন। NEO-র প্রার্থীদের তৈরি করতে গড়া হয় টিম টেরেস্ট্রিয়াল, আর বাংলাদেশ অলিম্পিয়াড অন অ্যাস্ট্রোনমি অ্যান্ড অ্যাস্ট্রোফিজিক্সের (BDOAA) জন্য টিম ইন্টারস্টেলার। IESO ও IOAA-র জন্য বিশেষভাবে গড়া বাংলাদেশের প্রথম দিকের দলগুলোর মধ্যে এরা অন্যতম, আর তখন থেকে এরা NDESC সদস্যদের জাতীয় ও আন্তর্জাতিক সাফল্যে নেতৃত্ব দিয়ে আসছে।",
  },
];

/** Why join (from the club's document). */
export const olympiadWhyJoin: { intro: L; items: { title: L; text: L }[] } = {
  intro: {
    en: "Team Interstellar and Team Terrestrial brought dedicated Olympiad training to NDESC. Both are guided by experienced mentors in astronomy and Earth science, and the mentoring is demanding but well organised, so members are ready for international competition.",
    bn: "টিম ইন্টারস্টেলার ও টিম টেরেস্ট্রিয়াল NDESC-এ নিবেদিত অলিম্পিয়াড প্রশিক্ষণ নিয়ে এসেছে। দুটি দলই জ্যোতির্বিজ্ঞান ও ভূবিজ্ঞানের অভিজ্ঞ মেন্টরদের তত্ত্বাবধানে চলে। মেন্টরিং কঠোর কিন্তু সুসংগঠিত, তাই সদস্যরা আন্তর্জাতিক প্রতিযোগিতার জন্য তৈরি হয়।",
  },
  items: [
    { title: { en: "Regular classes and assignments", bn: "নিয়মিত ক্লাস ও অ্যাসাইনমেন্ট" }, text: { en: "Structured learning that covers the whole syllabus.", bn: "পুরো সিলেবাস জুড়ে গোছানো শেখা।" } },
    { title: { en: "Frequent assessments", bn: "ঘন ঘন মূল্যায়ন" }, text: { en: "Regular checks on each member's progress, so everyone keeps growing.", bn: "প্রত্যেক সদস্যের অগ্রগতির নিয়মিত যাচাই, যাতে সবাই এগোতে থাকে।" } },
    { title: { en: "Practical training", bn: "ব্যবহারিক প্রশিক্ষণ" }, text: { en: "Hands-on experience that has led to results at national and international level.", bn: "হাতে-কলমে অভিজ্ঞতা, যা জাতীয় ও আন্তর্জাতিক পর্যায়ে সাফল্য এনেছে।" } },
  ],
};

/** How to join (from the club's document). */
export const olympiadHowToJoin: L = {
  en: "Every year about 7 to 10 members are selected for each team through team selection tests (TSTs). Before the tests, the club holds at least two sessions to introduce NDESC members to the Olympiad syllabi.",
  bn: "প্রতি বছর দল বাছাই পরীক্ষার (TST) মাধ্যমে প্রতিটি দলে ৭ থেকে ১০ জনের মতো সদস্য নেওয়া হয়। পরীক্ষার আগে NDESC সদস্যদের অলিম্পিয়াড সিলেবাসের সঙ্গে পরিচয় করাতে ক্লাব অন্তত দুটি সেশন আয়োজন করে।",
};

export function getTeam(slug: string): OlympiadTeam | undefined {
  return olympiadTeams.find((t) => t.slug === slug);
}

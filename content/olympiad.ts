import type { L } from "@/lib/i18n";

// NDESC's Olympiad teams. One source for the About page cards, /olympiad-teams/ and each team page.
// Only facts the club has given are here (About page text, 23 Nov 2026). Mentors, members, selection
// dates, photos, resources and achievements stay empty until the club confirms them, and the pages
// leave those sections out while they are empty.

export type Achievement = {
  year: string;
  competition: string;
  /** e.g. "Silver medal", "Honourable mention". Participation alone is not an achievement. */
  award: string;
  /** Student or team credit, only with their permission. */
  credit?: string;
  /** Link to an official result or news report. */
  source?: { label: string; url: string };
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
  mentors: { name: string; role: string }[];
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

export const olympiadTeams: OlympiadTeam[] = [
  {
    slug: "interstellar",
    name: "Team Interstellar",
    olympiad: { name: { en: "International Olympiad on Astronomy and Astrophysics", bn: "ইন্টারন্যাশনাল অলিম্পিয়াড অন অ্যাস্ট্রোনমি অ্যান্ড অ্যাস্ট্রোফিজিক্স" }, short: "IOAA" },
    discipline: { en: "Astronomy and astrophysics", bn: "জ্যোতির্বিজ্ঞান ও জ্যোতির্পদার্থবিজ্ঞান" },
    overview: {
      en: "Team Interstellar is NDESC's astronomy team. Under the guidance of the club's mentors, its members prepare for the International Olympiad on Astronomy and Astrophysics.",
      bn: "টিম ইন্টারস্টেলার NDESC-এর জ্যোতির্বিজ্ঞান দল। ক্লাবের মেন্টরদের তত্ত্বাবধানে এর সদস্যরা ইন্টারন্যাশনাল অলিম্পিয়াড অন অ্যাস্ট্রোনমি অ্যান্ড অ্যাস্ট্রোফিজিক্সের প্রস্তুতি নেয়।",
    },
    preparation: [
      ...prepCommon,
      { en: "Stargazing and solar observation with the club's own telescope.", bn: "ক্লাবের নিজস্ব টেলিস্কোপে তারা দেখা ও সূর্য পর্যবেক্ষণ।" },
    ],
    mentors: [],
    achievements: [],
    milestones: [],
    photos: [],
    resources: [],
  },
  {
    slug: "terrestrial",
    name: "Team Terrestrial",
    olympiad: { name: { en: "International Earth Science Olympiad", bn: "ইন্টারন্যাশনাল আর্থ সায়েন্স অলিম্পিয়াড" }, short: "IESO" },
    discipline: { en: "Earth science", bn: "ভূবিজ্ঞান" },
    overview: {
      en: "Team Terrestrial is NDESC's Earth science team. Under the guidance of the club's mentors, its members prepare for the International Earth Science Olympiad.",
      bn: "টিম টেরেস্ট্রিয়াল NDESC-এর ভূবিজ্ঞান দল। ক্লাবের মেন্টরদের তত্ত্বাবধানে এর সদস্যরা ইন্টারন্যাশনাল আর্থ সায়েন্স অলিম্পিয়াডের প্রস্তুতি নেয়।",
    },
    preparation: prepCommon,
    mentors: [],
    achievements: [],
    milestones: [],
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
    mentors: [],
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

export function getTeam(slug: string): OlympiadTeam | undefined {
  return olympiadTeams.find((t) => t.slug === slug);
}

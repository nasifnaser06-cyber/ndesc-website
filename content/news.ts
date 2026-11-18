import type { L } from "@/lib/i18n";

// News posts. Body paragraphs are plain text, one string per paragraph.
export type NewsCategory = "announcements" | "sky" | "eco" | "results";

export const newsCategories: Record<NewsCategory, L> = {
  announcements: { en: "Announcements", bn: "ঘোষণা" },
  sky: { en: "Sky this month", bn: "এ মাসের আকাশ" },
  eco: { en: "Eco notes", bn: "পরিবেশ ভাবনা" },
  results: { en: "Results", bn: "ফলাফল" },
};

export type Post = {
  slug: string;
  date: string;
  category: NewsCategory;
  title: L;
  summary: L;
  body: L[];
};

export const posts: Post[] = [
  {
    slug: "ness-2027-dates",
    date: "2026-11-18",
    category: "announcements",
    title: { en: "NESS 2027 runs from 28 to 30 January", bn: "NESS ২০২৭ হবে ২৮ থেকে ৩০ জানুয়ারি" },
    summary: {
      en: "The National Earth and Space Summit returns to Notre Dame College, and organisations can apply to exhibit.",
      bn: "ন্যাশনাল আর্থ অ্যান্ড স্পেস সামিট আবার নটর ডেম কলেজে, আর বিভিন্ন প্রতিষ্ঠান প্রদর্শনীর জন্য আবেদন করতে পারবে।",
    },
    body: [
      {
        en: "The next National Earth and Space Summit takes place at Notre Dame College, Dhaka, from 28 to 30 January 2027. Students from primary to higher secondary level can compete in olympiads, quizzes, team contests and creative events on ecology, earth science and astronomy.",
        bn: "পরবর্তী ন্যাশনাল আর্থ অ্যান্ড স্পেস সামিট হবে নটর ডেম কলেজ, ঢাকায়, ২৮ থেকে ৩০ জানুয়ারি ২০২৭। প্রাথমিক থেকে উচ্চমাধ্যমিক পর্যায়ের শিক্ষার্থীরা পরিবেশ, ভূবিজ্ঞান ও জ্যোতির্বিজ্ঞান বিষয়ে অলিম্পিয়াড, কুইজ, দলীয় ও সৃজনশীল প্রতিযোগিতায় অংশ নিতে পারবে।",
      },
      {
        en: "Universities, research teams, clubs and companies can take a stall to show their projects. Registration details and fees will be posted on the NESS 2027 page. [Add the registration date]",
        bn: "বিশ্ববিদ্যালয়, গবেষণা দল, ক্লাব ও প্রতিষ্ঠান স্টল নিয়ে তাদের প্রকল্প দেখাতে পারবে। নিবন্ধনের তথ্য ও ফি NESS ২০২৭ পাতায় জানানো হবে। [নিবন্ধনের তারিখ যোগ করুন]",
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

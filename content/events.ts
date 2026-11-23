
// The club's events. Facts come from press coverage (see `sources`).
// To add an event, copy an entry, give it a new slug and fill in the fields.

export type EventType = "ness" | "cosmoterrium" | "space-camp" | "workshop" | "stargazing";

export type ClubEvent = {
  slug: string;
  type: EventType;
  start: string; // YYYY-MM-DD
  end?: string;
  title: string;
  venue: string;
  summary: string;
  /** Shown as [placeholder] when the club still has to confirm something about the event. */
  todo?: string;
  facts?: { label: string; value: string }[];
  highlights?: string[];
  partners?: string;
  sources?: { title: string; url: string }[];
  /** Poster or banner. Files go in public/, e.g. public/ness/. `name` is the file name without the width and extension. */
  poster?: { name: string; widths: number[]; alt: string; social?: string };
};

/** The official NESS X banner, used on the home page, the NESS page and the event page. */
export const ness2027Banner = {
  name: "/ness/ness-2027",
  widths: [768, 1280, 1920],
  social: "/ness/ness-2027-og.jpg",
  alt: "NESS X, the 10th National Earth and Space Summit: two polar bears on melting ice reach towards each other under a pastel sky, with the Notre Dame College and club logos.",
};

const ndc: string = "Notre Dame College, Dhaka";

export const eventTypes: Record<EventType, string> = {
  ness: "NESS",
  cosmoterrium: "Cosmoterrium",
  "space-camp": "Space camp",
  workshop: "Workshop",
  stargazing: "Stargazing",
};

export const events: ClubEvent[] = [
  {
    slug: "ness-x",
    type: "ness",
    start: "2027-01-28",
    end: "2027-01-30",
    // Named like the other summits in the events list (Mahmud, 21 Nov 2026); the home page box still says NESS X.
    title: "10th National Earth and Space Summit",
    venue: ndc,
    summary: "NESS X, the 10th summit: three days of olympiads, quizzes, team contests, exhibitions and talks for students from Nursery to Class 12.",
    todo: "day-by-day schedule",
    facts: [
      { label: "Passes", value: "Solo 200 BDT, team 300 BDT per person. Online submission segments are free." },
      { label: "Registration", value: "Open now, online or at registration booths" },
    ],
    poster: ness2027Banner,
  },
  {
    slug: "cosmoterrium-2",
    type: "cosmoterrium",
    start: "2026-10-09",
    title: "Cosmoterrium 2.0",
    venue: "Notre Dame College, for its students only",
    summary: "The second Cosmoterrium, the club's intra-college festival.",
    todo: "segments, passes and highlights",
  },
  {
    slug: "cosmoterrium-2026",
    type: "cosmoterrium",
    start: "2026-01-17",
    title: "Cosmoterrium 1.0",
    venue: "Notre Dame College, for its students only",
    summary: "The club's intra-college festival: olympiads, quizzes, games, sessions and the Stellarscapes astro exhibits.",
    facts: [
      { label: "Passes", value: "Solo pass 70 BDT, team pass 100 BDT per person" },
    ],
    sources: [{ title: "HappeningNext event listing", url: "https://happeningnext.com/event/cosmoterrium-2026-eid3a0d7pqrpo" }],
  },
  {
    slug: "ness-2026",
    type: "ness",
    start: "2026-04-09",
    end: "2026-04-11",
    title: "9th National Earth and Space Summit",
    venue: ndc,
    summary: "The 9th summit: olympiads, quizzes, team contests, exhibitions and talks at Notre Dame College.",
    todo: "highlights, participants and partners",
  },
  {
    slug: "ness-2025",
    type: "ness",
    start: "2025-02-20",
    end: "2025-02-22",
    title: "8th National Earth and Space Summit",
    venue: ndc,
    summary: "Nearly 2,000 participants from more than 60 institutions, from primary to higher secondary level.",
    facts: [
      { label: "Reach", value: "Nearly 2,000 participants from more than 60 institutions" },
    ],
    partners: "Western Engineering (title sponsor), Bata (gold sponsor), Savoy Ice Cream, Dot Internet, MICB Scientific Society (telescope partner)",
    highlights: [
      "Astrophotography talk by Zubuyer Kaolin, with nearly 1,000 in the audience, and the Photosphere exhibition of his work.",
      "Students from the Islamic University of Technology unveiled the Formula IUT student race car.",
      "Visitors watched the Sun through a solar telescope.",
    ],
    sources: [
      { title: "The Daily Star: Notre Dame College hosts 8th National Earth and Space Summit", url: "https://www.thedailystar.net/campus/noticeboard/news/notre-dame-college-hosts-8th-national-earth-and-space-summit-3840246" },
      { title: "The Financial Express: Notre Dame College hosts landmark 8th NESS", url: "https://thefinancialexpress.com.bd/youth-and-entrepreneurship/notre-dame-college-hosts-landmark-8th-national-earth-and-space-summit" },
    ],
  },
  {
    slug: "ness-2024",
    type: "ness",
    start: "2024-05-16",
    end: "2024-05-18",
    title: "7th National Earth and Space Summit",
    venue: ndc,
    summary: "About 2,500 participants and 6,000 visitors from more than 50 institutes, across 27 competitions.",
    partners: "JR Recycling (title sponsor), Bata Children's Programme, BDOAA and National Earth Olympiad (academic partners), MICB Scientific Society (telescope partner)",
    highlights: [
      "Olympiad questions set by the Bangladesh Olympiad on Astronomy and Astrophysics and the National Earth Olympiad.",
      "Amateur Experimental Rocketry Dhaka tested a hybrid rocket engine.",
      "The Astral Hunt, a campus treasure hunt with astronomy clues, and the Astro and Eco Ideation contest.",
    ],
    sources: [
      { title: "The Financial Express: 7th Nature and Earth Summit held", url: "https://today.thefinancialexpress.com.bd/print/7th-nature-and-earth-summit-held-1716050238" },
      { title: "Bangladesh Post: 7th National Earth and Space Summit begins", url: "https://bangladeshpost.net/posts/7th-nat-l-earth-space-summit-begins-at-ndc-on-may-16-137309" },
    ],
  },
  {
    slug: "ness-2022",
    type: "ness",
    start: "2022-05-19",
    end: "2022-05-21",
    title: "5th National Earth and Space Summit",
    venue: ndc,
    summary: "The summit came back to campus after an online year, with more than 15 activities on ecology and astronomy.",
    todo: "confirm reach: press reports differ",
    sources: [{ title: "Dhaka Tribune: Fifth National Earth and Space Summit held at Notre Dame College", url: "https://www.dhakatribune.com/bangladesh/288904/fifth-national-earth-and-space-summit-held-at" }],
  },
  {
    slug: "astronomy-workshop-2020",
    type: "workshop",
    start: "2020-03-11",
    title: "Astronomy Workshop with BARC",
    venue: ndc,
    summary: "A workshop run with the Bangladesh Astronomy Research Center for Notre Dame College students.",
    sources: [{ title: "Bangladesh Astronomy Research Center news", url: "https://barcbd.org/news/" }],
  },
  {
    slug: "ness-2019",
    type: "ness",
    start: "2019-09-20",
    end: "2019-09-21",
    title: "3rd National Earth and Space Summit",
    venue: ndc,
    summary: "15 events for junior, secondary and higher secondary students, from olympiads to sci-fi story writing.",
    partners: "GPH Ispat (presenting), Shamsul Alamin Real Estate (gold sponsor), The Daily Star (media)",
    sources: [{ title: "Youth Opportunities: 3rd National Earth and Space Summit 2019", url: "https://www.youthop.com/bd/competitions/3rd-national-earth-space-summit-2019-in-dhaka" }],
  },
  {
    slug: "space-camp-2018",
    type: "space-camp",
    start: "2018-10-11",
    end: "2018-10-12",
    title: "2nd National Space Camp",
    venue: ndc,
    summary: "Stargazing night camp, workshops, Space Olympiad, wall magazines, Space Buzz quiz and Space Talk.",
    sources: [{ title: "Youth Opportunities: 2nd National Space Camp 2018", url: "https://www.youthop.com/bd/competitions/2nd-national-space-camp-2018-in-dhaka" }],
  },
];

/** Upcoming means the event has not finished on the day the site was built. */
export function isUpcoming(e: ClubEvent, today = new Date()): boolean {
  const end = new Date(`${e.end ?? e.start}T23:59:59+06:00`);
  return end >= today;
}

export function sortedEvents(): ClubEvent[] {
  return [...events].sort((a, b) => b.start.localeCompare(a.start));
}

export function getEvent(slug: string): ClubEvent | undefined {
  return events.find((e) => e.slug === slug);
}

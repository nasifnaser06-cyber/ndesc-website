// Club-wide settings. Fill in the nulls as the club confirms them;
// anything left null shows on the site as a [placeholder] or a disabled button.

export const site = {
  shortName: "NDESC",
  name: { en: "Notre Dame Eco and Space Club", bn: "নটর ডেম ইকো অ্যান্ড স্পেস ক্লাব" },
  founded: "1992-10-28",
  college: { en: "Notre Dame College, Dhaka", bn: "নটর ডেম কলেজ, ঢাকা" },
  address: {
    en: "Notre Dame College, Toyenbee Circular Road, Motijheel, Dhaka 1000",
    bn: "নটর ডেম কলেজ, টয়েনবি সার্কুলার রোড, মতিঝিল, ঢাকা ১০০০",
  },
  mapUrl: "https://maps.app.goo.gl/N4N3Rvg5j3EB2ua16",

  /** Club email, monitored by the moderator. Never a student's personal address. */
  email: "ndesc.organizers.2027@gmail.com" as string | null,

  social: {
    facebook: "https://www.facebook.com/ndesc.official",
    instagram: "https://www.instagram.com/ndesc.official",
  },

  /** Links to the club's forms (Google Forms or similar). */
  forms: {
    nessRegister: "https://forms.gle/QAYuy9RbyRtvFyzC7" as string | null,
    nessExhibit: null as string | null,
    join: null as string | null,
    /** A form endpoint that accepts POST (e.g. Formspree). Leave null to hide the form. */
    contactEndpoint: null as string | null,
  },

  /**
   * NESSX automatic registration (registration/README.md explains the setup).
   * endpoint: the Apps Script web app address. While it is null the Register page is a draft:
   * people can see it, but it sends them to the Google Form instead.
   * The payment numbers and prices shown on the page come live from the sheet's Settings tab once
   * connected; these are only the fallback.
   * trial: true while testing with the trial sheet (10 Tk payments). The page stays hidden from
   * search engines and shows a "Trial" notice. Set false only with the club's real sheet.
   */
  registration: {
    endpoint: "https://script.google.com/macros/s/AKfycby3yB5j63X8mhkT4IEiPn_b058nqc5_zzc70K7Q0iTk96rhVnu4k0-6Ll7P2BKYGPzs/exec" as string | null,
    trial: true,
    bkash: "[club bKash number]",
    nagad: null as string | null,
    prices: { solo: 200, team: 300, online: 0 },
  },

  /** Shows the "draft" ribbon across the top until the club signs off the content. */
  draft: true,
};

export type Site = typeof site;

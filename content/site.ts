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
  email: null as string | null,

  social: {
    facebook: "https://www.facebook.com/ndesc.official",
    instagram: "https://www.instagram.com/ndesc.official",
  },

  /** Links to the club's forms (Google Forms or similar). */
  forms: {
    nessRegister: null as string | null,
    nessExhibit: null as string | null,
    join: null as string | null,
    /** A form endpoint that accepts POST (e.g. Formspree). Leave null to hide the form. */
    contactEndpoint: null as string | null,
  },

  /** Shows the "draft" ribbon across the top until the club signs off the content. */
  draft: true,
};

export type Site = typeof site;

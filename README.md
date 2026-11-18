# Notre Dame Eco and Space Club website

The website of the Notre Dame Eco and Space Club (NDESC), Notre Dame College, Dhaka. It is in English and Bangla.

**Live site:** https://nasifnaser06-cyber.github.io/ndesc-website/

This is a **draft**. Anything shown in [square brackets] on the site is waiting for the club to confirm or supply it. Facts on the site come from press coverage, and each summit page links its sources.

## Editing the content

You do not need to touch the page code to update the site. All the words and data live in the `content/` folder:

| File | What it holds |
|---|---|
| `content/site.ts` | Club email, social links, form links, address, the draft ribbon switch |
| `content/events.ts` | Every event: dates, titles, summaries, highlights, partners, press links |
| `content/club.ts` | Timeline, NESS programme, categories, schedule, past summits, FAQs, moderators, panel, resources, gallery albums |
| `content/news.ts` | News posts |
| `content/ui.ts` | Menu labels, button words and other short interface text |

Every piece of text has an English (`en`) and a Bangla (`bn`) version. The Bangla is a draft translation, so please have someone check it.

You can edit these files right on GitHub: open the file, click the pencil icon, make the change and click **Commit changes**. The site rebuilds and goes live by itself in about two minutes.

### Common jobs

- **Add the club email:** in `content/site.ts`, change `email: null` to `email: "club@example.com"`.
- **Turn on registration buttons:** put the Google Form links into `forms` in `content/site.ts`. Until a link is there, the button says "Form link coming soon".
- **Turn on the contact form:** set `contactEndpoint` to a form service address that accepts posts (for example Formspree). Until then the Contact page points people to Facebook.
- **Add an event:** copy an entry in `content/events.ts`, give it a new `slug` (a short name with hyphens, e.g. `ness-2028`) and change the details. It gets its own page automatically.
- **Add a news post:** copy the post in `content/news.ts`, change the `slug`, date and text.
- **Add resources:** put the PDF in `public/resources/` and add a line to `resources` in `content/club.ts`, with `url: "/resources/your-file.pdf"`.
- **Fill a placeholder:** search the `content/` folder for the text in square brackets and replace it.
- **Remove the draft ribbon:** set `draft: false` in `content/site.ts` once the club is happy.

### Students' privacy

Students' names and photos appear on the site only with their consent. Never put a student's personal phone number or home address on the site; contact goes through the club email or Facebook page.

## Running it on your computer

You need Node.js 22.

```bash
npm install
npm run dev
```

Then open http://localhost:3000/en/.

To build the finished static site into the `out/` folder: `npm run build`.

## How publishing works

Every change pushed to the `main` branch runs the workflow in `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. It also rebuilds every Monday so "Upcoming" and "Past" labels on events stay right.

The site is built with Next.js as plain static pages (`output: "export"`), so search engines and Facebook link previews can read every page.

## Design

Night-sky look: night `#0F1E36`, starlight text `#E9EEF6`, haze `#A9B7CC`, one sprout-green accent `#8FD3A6`. Headings in Bitter, body text in Atkinson Hyperlegible, Bangla in Noto Serif Bengali and Noto Sans Bengali. All fonts are self-hosted. Every text colour pair passes WCAG AA contrast.

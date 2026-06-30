# Golden Hour Films — Portfolio Site

A bold, cinematic dark-themed portfolio for a wedding & event videographer.
Plain HTML/CSS/JS — no build step, no framework. Open `index.html` in a
browser and it just works.

## Files
- `index.html` — page structure & copy
- `styles.css` — all styling (design tokens are at the top as CSS variables)
- `script.js` — mobile nav, the live timecode in the top-right corner,
  footer year, and a placeholder contact form handler

## The signature touch
There's a small "● REC 00:00:00:00" timecode in the top-right corner that
runs the whole time someone's on the site, like the camera never stopped
rolling. It's pure CSS/JS, no video file needed.

## What to swap in first
1. **Brand name** — search for "Golden Hour Films" in `index.html` and
   replace with your studio name.
2. **Your name** — replace every `[Your Name]` in the About section.
3. **Location** — replace `[Your City, State]` and `[Your City]`.
4. **Reel videos** — each card in `.reel-grid` has a `.reel-thumb` div
   styled with a gradient placeholder. Swap it for a real `<video>` element
   or thumbnail `<img>`, and wire the play button to open a lightbox or
   link to Vimeo/YouTube.
5. **Portrait photo** — replace `.portrait-frame` in the About section with
   an `<img>`.
6. **Pricing** — update the numbers and inclusions in the Formats section
   to match your actual packages.
7. **Contact form** — it currently shows a message on submit but doesn't
   send anywhere. Easiest fix: sign up for a free plan at
   [Formspree](https://formspree.io) or [Basin](https://usebasin.com),
   then point the `<form>`'s `action` at the endpoint they give you and
   remove the `e.preventDefault()` in `script.js`.
8. **Email/socials** — update the footer links (`mailto:` address,
   Instagram, Vimeo).

## Hosting on your domain
Since this is a static site, any of these work well and are free or
near-free:

- **Netlify** or **Vercel** — drag-and-drop the folder, then point your
  domain's DNS at them (both have simple guides for custom domains).
- **GitHub Pages** — push this folder to a repo and enable Pages in the
  repo settings.
- **Your existing registrar's hosting** (e.g. GoDaddy, Namecheap) — upload
  the three files via their file manager or FTP if they offer basic
  static hosting.

If you tell me where you bought the domain, I can give you exact steps for
pointing it at whichever host you pick.

## Notes
- Fully responsive, with a mobile nav menu under ~860px.
- Respects `prefers-reduced-motion` (grain animation, scroll cue, and the
  ticking timecode all pause for users who've requested less motion).
- Fonts load from Google Fonts (Big Shoulders Display, Newsreader, Space
  Mono) — keep an internet connection in production, or self-host them if
  you'd rather not depend on Google Fonts.

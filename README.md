# Warker Weddings and Events — Portfolio Site

A bold, cinematic dark-themed portfolio for a wedding & event videographer.
Plain HTML/CSS/JS — no build step, no framework. Open `index.html` in a
browser and it just works.

## Files
- `index.html` — homepage: hero, The Reel, The Album, The View from the
  Clouds, About, a Rates teaser, and Contact
- `rates.html` — standalone page with the full pricing breakdown
- `styles.css` — all styling (design tokens are at the top as CSS variables),
  shared by both pages
- `script.js` — mobile nav, footer year, and a placeholder contact form
  handler, shared by both pages
- `assets/` — you'll need to create this folder and add your own video files
  (see below); it doesn't exist yet

## Adding your videos
The site references two video files that don't exist yet — without them,
the hero just shows its plain background and the reel section shows an
empty player frame, which is fine to leave while you're still gathering
footage.

1. Create a folder named `assets` next to `index.html`.
2. **Hero background video** — add a short, silent, looping clip (10–20
   seconds works well) named `hero-reel.mp4` to `assets/`. It plays
   muted and on loop behind the homepage banner, desaturated to match the
   black-and-white look. Keep the file small (under ~10MB) so it loads fast.
3. **Featured wedding film** — add your main reel as `assets/wedding-reel.mp4`.
   This one has visible playback controls and is the single film shown in
   "The Reel" section. Update the title, location, and runtime text next to
   it in `index.html` to match.
4. **Drone reel** — add an aerial highlight clip as `assets/drone-reel.mp4`.
   It plays in "The View from the Clouds" alongside the aerial photos.

If you'd rather host video elsewhere (YouTube/Vimeo) instead of serving
files directly, let me know and I can swap in an embed instead.

## Adding your photos
"The Album" and "The View from the Clouds" sections currently show
placeholder gradient blocks instead of real photos. Each photo lives inside
a `.album-photo` div in `index.html` — replace each one with an `<img>` tag
pointing at your own image, and update the caption text in the matching
`<figcaption>`.

## What to swap in first
1. **Your name** — replace every `[Your Name]` in the About section.
2. **Location** — replace `[Your City, State]` and `[Your City]`.
3. **Reel video** — see "Adding your videos" above for where the files go.
4. **Portrait photo** — replace `.portrait-frame` in the About section with
   an `<img>`.
5. **Pricing** — update the numbers and inclusions in the Formats section
   to match your actual packages.
6. **Contact form** — it currently shows a message on submit but doesn't
   send anywhere. Easiest fix: sign up for a free plan at
   [Formspree](https://formspree.io) or [Basin](https://usebasin.com),
   then point the `<form>`'s `action` at the endpoint they give you and
   remove the `e.preventDefault()` in `script.js`.
7. **Email/socials** — update the footer links (`mailto:` address,
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
- Respects `prefers-reduced-motion` (grain animation and scroll cue pause
  for users who've requested less motion).
- Fonts load from Google Fonts (Cormorant, Cormorant Garamond, Caveat) —
  keep an internet connection in production, or self-host them if you'd
  rather not depend on Google Fonts.

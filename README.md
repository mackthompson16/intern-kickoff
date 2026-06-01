# Bay Area Intern Kickoff MVP

React + Vite starter for a low-code event landing site, optimized for GitHub Pages deployment.

## What This MVP Includes

- Event landing page with Bay Area Intern Kickoff positioning
- Countdown, RSVP shell, and QR certificate preview
- Plugin-heavy UI stack to reduce custom coding
- Integration panel for no-code tools (Luma, Tally, Airtable, Zapier, Canva)

## Plugin Stack

- `react-bootstrap` + `bootstrap`
- `aos` for reveal animations
- `react-countdown` + `dayjs` for timing
- `react-parallax-tilt` for card interaction
- `react-qr-code` for RSVP token preview
- `@tippyjs/react` for tooltips
- `react-toastify` for instant status feedback
- `gh-pages` for deployment

## Local Development

```bash
npm install
npm run dev
```

## GitHub Pages Deploy

1. Ensure your GitHub repo is `intern-kickoff` under `mackthompson16`.
2. Confirm `homepage` in `package.json` is `https://mackthompson16.github.io/intern-kickoff`.
3. Confirm `base` in `vite.config.js` is `/intern-kickoff/`.
4. Deploy:

```bash
npm run deploy
```

## No-Code Integrations To Connect Next

- Replace Luma/Partiful links in the hero CTA buttons
- Replace Tally link in the RSVP section with your real form
- Connect Airtable + Zapier for approval and auto-certificate workflows
- Add your exact venue and host constraints once confirmed

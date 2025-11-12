# Handcrafted Haven — Mockup Implementation (Next.js)

This repository contains a static mockup implemented initially as HTML/CSS and now scaffolded as a Next.js app.

Getting started (development):

1. Install dependencies:

```powershell
# from the repository root
npm install
```

2. Run the dev server:

```powershell
npm run dev
# Open http://localhost:3000
```

Notes:

- The current project uses Next.js for quick iteration. Styles are in `styles/globals.css`.
- Static SVG placeholders are in `public/assets/`. Replace these with production images if desired.

What I added:

- `package.json` with Next.js, React and scripts
- `pages/_app.js` and `pages/index.js` (React/Next entry)
- `styles/globals.css` (global stylesheet)
- `public/assets/` (logo, hero placeholder, product placeholders, avatars)

Next steps you can ask me to do:

- Replace SVG placeholders with real photography and optimize images.
- Convert this into the App Router structure, add dynamic product data, or wire up a headless CMS.
- Improve accessibility and add unit tests.

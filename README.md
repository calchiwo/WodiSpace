## WodiSpace

![Next.js](https://img.shields.io/badge/Next.js-App_Router-black)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![License](https://img.shields.io/badge/License-MIT-green)

WodiSpace is an open-source web app for exploring **NASA Astronomy Picture of the Day (APOD)**.

It provides a simple, clean interface that lets you browse NASA’s daily astronomical images

![APOD December 27 2025](assets/apod-2025-12-27.png)

![APOD December 03 2025](assets/apod-2025-12-03.png)

[Live App ↗](https://wodispace.vercel.app)

## About APOD

The **NASA Astronomy Picture of the Day** (APOD) is a daily publication by **NASA** since June 16, 1995.
It was created by astronomers **Robert Nemiroff** and **Jerry Bonnell** to share daily annotated images of space with accessible explanations

Each day, NASA publishes:

* one astronomical image or video
* a detailed explanation written by a professional astronomer
* scientific context about the universe

APOD covers galaxies, nebulae, planets, stars, and cosmic phenomena, ranging from events in our solar system to structures billions of light-years away.

## What WodiSpace does

* Displays today’s Astronomy Picture of the Day
* Supports browsing APOD by date
* Handles both image and video entries
* Preserves full attribution to NASA and original photographers and image creators
* Respects NASA’s data usage guidelines.
* Uses a distraction free dark interface suited for astronomical content
* Prioritizes clarity, accuracy, and respect for the science behind them.

## What WodiSpace does *not* do

* It does not generate content
* It does not modify NASA’s explanations
* It does not use AI to rewrite or summarize
* It does not track users or add social features

WodiSpace is a viewer, not a generator.

## Data source and attribution

All data shown in WodiSpace is fetched live from the official [APOD public API](https://github.com/nasa/apod-api) provided by NASA

## Design philosophy

Every design choice in WodiSpace follows principles I choose deliberately:

* **Clarity**
  Large typography and generous spacing improve readability.

* **Respect**
  The interface treats both the content and the viewer seriously.

* **Minimalism**
  No animations, gradients, or decorative effects.

* **Science-first**
  A dark theme that complements astronomical imagery instead of competing with it.

## Tech Stack

* Next.js
* TypeScript
* Tailwind CSS
* Server-side data fetching
* NASA APOD API

## Run Locally
```bash
git clone https://github.com/calchiwo/WodiSpace.git
cd WodiSpace
pnpm install
pnpm dev
```

## Project Structure
```bash
WodiSpace/
├── app/                # App router pages and layouts
│   ├── about/          # About page
│   ├── browse/         # Date browsing feature
│   ├── api/            # Server routes (APOD fetching)
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page (today's APOD)
│
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and API helpers
├── public/             # Static assets
├── styles/             # Additional styling
├── assets/             # README screenshots
├── next.config.mjs     # Next.js configuration
├── postcss.config.mjs  # PostCSS config
├── tsconfig.json       # TypeScript config
├── package.json        # Dependencies and scripts
├── pnpm-lock.yaml      # Package lock file
├── components.json     # UI config
├── LICENSE
└── README.md
```

## License

[MIT License](LICENSE)

## Author

- **Caleb Wodi**
- [Twitter](https://x.com/calchiwo)
- [LinkedIn](https://www.linkedin.com/in/calchiwo)

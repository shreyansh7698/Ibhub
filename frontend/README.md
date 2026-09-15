# The International Business Hub

A premium, responsive international business consultancy website built with React + Vite.

## Tech Stack

- React.js + Vite
- React Router DOM
- Framer Motion (animations)
- Lucide React (icons)
- React Icons (social/brand icons)
- React Helmet Async (per-page SEO)
- Plain CSS (no Tailwind)

## Getting Started

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal (default http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  components/    Reusable UI components
  pages/         Route-level pages
  data/          Content data (services, countries, testimonials, faq, formations, blog)
  styles/        Global + section CSS
  App.jsx        Routes
  main.jsx       App entry
```

## Configuration

- WhatsApp button number: edit `WHATSAPP_NUMBER` in `src/components/WhatsAppButton.jsx`.
- Contact details: edit `src/data/site.js`.
- Forms simulate submission with React state — connect an API in
  `src/components/ConsultationForm.jsx` (`onSubmit` handler).

## Disclaimer

All content is illustrative. Services are described as assistance and guidance only —
outcomes such as bank account opening, visa issuance, and company approval are subject
to eligibility and regulatory approval.

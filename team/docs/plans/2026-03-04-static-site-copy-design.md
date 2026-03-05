# Design: Sierra & Sea Suite Static Website Copy

## Goal
Copy the current Webflow site (sierraseasuite.com) to a self-hosted static site. Pixel-perfect design match, unique meta tags per page, bilingual (EN/ES), no framework dependencies.

## Approach
Pure HTML/CSS/JS. One HTML file per page, shared CSS, minimal JS. No build step required.

## File Structure
```
website/
├── index.html                          # EN landing
├── contact-us.html
├── faq.html
├── rules-and-policies.html
├── data-polices.html
├── santa-marta-and-sierra-nevada-tourist-guide.html
├── post/
│   ├── santa-marta-first-time-guide.html
│   └── aventuras-caminatas-sierra-nevada-santa-marta.html
├── category/
│   ├── activities.html
│   ├── dinning.html
│   └── travel.html
├── es/
│   ├── inicio.html
│   ├── contactanos.html
│   ├── preguntas-fecuentes.html
│   ├── reglas-y-politicas.html
│   ├── habeas-data.html
│   └── guia-turistica.html
├── post-espanol/
│   ├── guia-viaje-santa-marta-playas-historia-aventura.html
│   └── explorando-la-sierra-nevada-de-santa-marta-aventuras-de-trekking-y-encuentros-con-comunidades-indigenas.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── images/
│   ├── logo/
│   ├── hero/
│   ├── gallery/
│   ├── amenities/
│   ├── blog/
│   └── icons/
└── favicon.ico
```

## Key Decisions
- **Pixel-perfect**: Scrape actual CSS values (fonts, colors, spacing, breakpoints) from live Webflow site
- **Unique meta tags**: Each page gets custom title, description, OG tags, Twitter cards
- **URL structure preserved**: Same paths as current site for SEO continuity
- **Images**: Scraped from live site, served locally
- **Contact form**: UI present, submission logic TBD (placeholder)
- **Language switcher**: Simple links between EN/ES versions
- **No build step**: Preview with `npx serve website/` or `python3 -m http.server`

## Build Order
1. Scrape images and CSS values from live site
2. EN landing page (hero, gallery, map, amenities — most complex)
3. Shared header/footer pattern, then remaining EN pages
4. ES pages (duplicate structure, translated content)
5. Blog posts and category pages

## Content Source
Full site map documented in `features/specs/S1-site-content-map.md` (20 pages, 17 FAQ items, 2 blog posts per language).

## Out of Scope (for now)
- Form submission backend
- Hosting selection
- Analytics/tracking
- New content or design changes

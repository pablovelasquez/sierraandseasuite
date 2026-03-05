# Sierra & Sea Suite Static Website — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Pixel-perfect static copy of sierraseasuite.com — 20 pages, bilingual EN/ES, locally servable.

**Architecture:** Pure HTML/CSS/JS. One HTML per page, single shared stylesheet, minimal JS for interactivity (mobile nav, FAQ accordion). All images already downloaded to `website/images/`.

**Tech Stack:** HTML5, CSS3 (custom properties), vanilla JS, Google Fonts (Karla + Cormorant Upright)

---

## Reference: Design System (extracted from Webflow CSS)

```css
:root {
  --bg: #f1f1ed;
  --font-color: #6e7a73;
  --link: #555e59;
  --white: white;
  --bg-3: #d4d6ce;
  --lines: #b6b9af;
  --dropdown-bg-button: #d4d5cf;
  --bg-2: #8a968f;
  --button-hover-2: #7d8a83;
  --lines-2: #71847b;
  --link-hover: #6c7a72;
  --button-hover: #c8cabe;
  --font: #0f0e0f;
  --text-white: #e8e9e4;
  --slide-bg: #f7f6f4;
}
/* Fonts: Karla (body), Cormorant Upright (headings) */
/* Body: 17px, line-height 24px, letter-spacing -0.5px */
/* Max content width: 1000px centered */
/* Breakpoints: 991px (tablet), 767px (mobile landscape), 479px (mobile portrait) */
```

## Reference: Image Inventory

All images are in `website/images/` organized by folder:
- `logo/` — small-logo-square.png, medium-logo.png, logo.svg
- `hero/` — hero-beach-party.jpg, bg-vertical.jpg
- `gallery/` — 9.jpg, 12.jpg, 14.jpg, 18.jpg, 21.jpg, 43.jpg, 46.jpg, 47.jpg, 55.jpg, 60.jpg, 66.png
- `amenities/` — amenities-bg.jpg, pool.png, icon-exercise.svg, icon-jacuzzi.svg, icon-pool.png
- `maps/` — maps-overview.png, beach-access.png, building.png, map-1.png, map-2.png, map-3.png, map-5.png, about-1.png, intro-3.png, location-6.png
- `blog/` — post-bg.jpg, cabo-san-juan.jpeg, penthouse-66.png, arahuaca-family.jpeg
- `icons/` — airbnb-logo.png, airbnb.svg, vrbo-logo.png, vrbo.webp, facebook.svg, instagram.avif, close.png, close-alt.png, check-mark.png, next-arrow.png, scroll-down-arrow.png, icon-sea-sun.svg, icon-jacuzzi.svg, icon-hat.svg
- `og-image.jpg` — OpenGraph sharing image

## Reference: Full CSS file

The complete Webflow CSS is saved at `website/css/webflow-reference.css` (8518 lines). Use this as the authoritative reference for pixel-perfect matching — class names, spacing, colors, responsive breakpoints.

---

### Task 1: CSS Foundation + Google Fonts

**Files:**
- Create: `website/css/style.css`

**Step 1: Create the base stylesheet**

Build `style.css` with:
1. CSS reset (minimal, modern)
2. CSS custom properties (the `:root` block above)
3. Google Fonts import: `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Upright:wght@400;500;600;700&family=Karla:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400&display=swap');`
4. Base typography matching Webflow: body (Karla 17px/24px), h1-h6 (Cormorant Upright, sizes from reference)
5. `.inner-wrapper` (max-width: 1000px, centered)
6. Button base styles (`.button`, `.button-fill`)
7. Responsive breakpoints: 991px, 767px, 479px

Reference: `website/css/webflow-reference.css` lines 2057-2400 for exact values.

**Step 2: Verify**

Open in browser, confirm fonts load and base styles apply.

**Step 3: Commit**

```bash
git add website/css/style.css
git commit -m "feat: add CSS foundation with design system variables and typography"
```

---

### Task 2: Shared Header/Navigation Component

**Files:**
- Create: `website/js/main.js`
- Modify: `website/css/style.css` (append navbar styles)

**Step 1: Build the navigation HTML pattern**

Create the navbar HTML structure to be copied into each page:
- Logo (links to `/` or `/es/inicio`)
- Nav links: Home, Contact Us, Location (#location), Apartment (#penthouse), FAQ (dropdown or link), Rules & Policies, Tourist Guide
- Language switcher (EN/ES link)
- "Book Now!" CTA button (links to `#booking` section or Airbnb)
- Mobile hamburger menu

Reference the live site for exact structure. Match classes from `webflow-reference.css` lines 2649-2850 (`.navbar`, `.nav-link`, `.nav-menu`, etc.)

**Step 2: Add navbar CSS to style.css**

Copy the relevant navbar styles from `webflow-reference.css`. Key classes: `.navbar`, `.nav-link`, `.nav-menu`, `.nav-button`, `.brand`, plus responsive rules.

**Step 3: Add mobile menu toggle JS**

In `main.js`, add hamburger menu toggle:
```js
document.addEventListener('DOMContentLoaded', () => {
  const navButton = document.querySelector('.nav-button');
  const navMenu = document.querySelector('.nav-menu');
  if (navButton && navMenu) {
    navButton.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      navButton.classList.toggle('open');
    });
  }
});
```

**Step 4: Verify**

Test navbar in browser at desktop and mobile widths.

**Step 5: Commit**

```bash
git add website/js/main.js website/css/style.css
git commit -m "feat: add shared navigation with mobile menu"
```

---

### Task 3: Shared Footer Component

**Files:**
- Modify: `website/css/style.css` (append footer styles)

**Step 1: Build the footer HTML pattern**

Footer structure:
- Logo
- Navigation links (repeated from header)
- Social media icons (Facebook, Instagram) with `rel="noopener noreferrer" target="_blank"`
- Booking platform links (Airbnb, VRBO)
- Data Policy link
- Copyright notice

Reference: `webflow-reference.css` lines 4086-4310 (`.footer`, `.footer-links`, `.footer-flex`, `.footer-logo-link`, `.footer-notice-link`)

**Step 2: Add footer CSS**

**Step 3: Verify**

**Step 4: Commit**

```bash
git add website/css/style.css
git commit -m "feat: add shared footer component styles"
```

---

### Task 4: EN Landing Page (index.html) — Hero + Booking Section

**Files:**
- Create: `website/index.html`

**Step 1: Create index.html with full `<head>`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sierra & Sea Apartment Suite - One Block from the Beach in Santa Marta</title>
  <meta name="description" content="Experience the perfect getaway at Sierra & Sea Apartment Suite in Santa Marta. Enjoy breathtaking views where the Sierra Nevada mountains meet the Caribbean Sea. Just steps from Bello Horizonte Beach, this luxurious penthouse offers top amenities including a private jacuzzi and family-friendly pools.">
  <meta property="og:title" content="Sierra & Sea Apartment Suite - One Block from the Beach in Santa Marta, Where the Mountains Meet the Sea">
  <meta property="og:description" content="Experience the perfect getaway at Sierra & Sea Apartment Suite in Santa Marta...">
  <meta property="og:image" content="/images/og-image.jpg">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Sierra & Sea Apartment Suite - One Block from the Beach in Santa Marta, Where the Mountains Meet the Sea">
  <meta name="twitter:description" content="Experience the perfect getaway...">
  <meta name="twitter:image" content="/images/og-image.jpg">
  <link rel="icon" href="/favicon.ico">
  <link rel="stylesheet" href="/css/style.css">
</head>
```

**Step 2: Build the hero section**

Hero with background image (`hero/hero-beach-party.jpg`), overlay, headline text, booking CTA, scroll-down arrow. Match the live site layout exactly.

Reference: `webflow-reference.css` lines 2844-2920 (`.hero-section`, `.hero-subtitle`, `.hero-inner-padding`)

**Step 3: Build the booking bar**

Airbnb + VRBO buttons with logos and "Book Now" text.

**Step 4: Verify hero renders correctly**

**Step 5: Commit**

```bash
git add website/index.html
git commit -m "feat: add EN landing page with hero section"
```

---

### Task 5: EN Landing Page — Feature Cards + Welcome Section

**Files:**
- Modify: `website/index.html`
- Modify: `website/css/style.css`

**Step 1: Build three feature cards**

Three cards below hero:
1. Prime Location (sea/sun icon) — "One block from Bello Horizonte Beach..."
2. Comfort & Relax (jacuzzi icon) — "Private jacuzzi, pools..."
3. Explore Nature (hat icon) — "Sierra Nevada, Tayrona..."

Each card has: icon, title (Cormorant Upright), description, CTA link.

**Step 2: Build welcome/about section**

"Enjoy the best vacation accommodation" heading with descriptive text and property images.

**Step 3: Add CSS for feature cards and welcome section**

**Step 4: Verify**

**Step 5: Commit**

```bash
git add website/index.html website/css/style.css
git commit -m "feat: add feature cards and welcome section to landing page"
```

---

### Task 6: EN Landing Page — Location Map Section

**Files:**
- Modify: `website/index.html`
- Modify: `website/css/style.css`

**Step 1: Build location section with map graphic**

Section with `id="location"`. Visual map showing:
- Beach (2 min walk)
- Airport (15 min)
- Taganga
- Historic Center
- Tayrona

Use the map images from `images/maps/`. Include Google Maps link.

**Step 2: Add CSS**

**Step 3: Verify**

**Step 4: Commit**

```bash
git add website/index.html website/css/style.css
git commit -m "feat: add location map section to landing page"
```

---

### Task 7: EN Landing Page — Penthouse Gallery

**Files:**
- Modify: `website/index.html`
- Modify: `website/css/style.css`

**Step 1: Build gallery section**

Section with `id="penthouse"`. Grid of property photos from `images/gallery/`. Match the Webflow gallery layout (masonry-style or grid).

Reference: `webflow-reference.css` lines 2908-2940 (`.parallax-bg.gallery*`), lines 3684-3710 (`.gallery-column`, `.gallery-column-4`)

**Step 2: Add gallery CSS with responsive grid**

**Step 3: Verify gallery renders at all breakpoints**

**Step 4: Commit**

```bash
git add website/index.html website/css/style.css
git commit -m "feat: add penthouse gallery section to landing page"
```

---

### Task 8: EN Landing Page — Amenities + Blog Preview + Footer

**Files:**
- Modify: `website/index.html`
- Modify: `website/css/style.css`

**Step 1: Build amenities section**

Three amenity highlights with background image (`amenities/amenities-bg.jpg`):
1. Swimming Pools (icon-pool)
2. Exercise/Gym (icon-exercise)
3. Relax/Jacuzzi (icon-jacuzzi)

Reference: `webflow-reference.css` line 3643 (`.amenities-flex`)

**Step 2: Build blog/tourist guide preview**

Two blog post cards linking to the tourist guide posts. Each card: background image, title, excerpt, "Read More" link.

Reference: `webflow-reference.css` line 5735 (`.blog-left`)

**Step 3: Add footer HTML (from Task 3 pattern)**

**Step 4: Add all CSS for amenities and blog preview**

**Step 5: Verify complete landing page**

Test full scroll from hero to footer at desktop, tablet, and mobile.

**Step 6: Commit**

```bash
git add website/index.html website/css/style.css
git commit -m "feat: complete EN landing page with amenities, blog preview, and footer"
```

---

### Task 9: EN Secondary Pages — FAQ

**Files:**
- Create: `website/faq.html`
- Modify: `website/css/style.css`
- Modify: `website/js/main.js`

**Step 1: Create faq.html with unique meta tags**

```html
<title>FAQ - Sierra & Sea Apartment Suite</title>
<meta name="description" content="Frequently asked questions about Sierra & Sea Apartment Suite in Santa Marta, Colombia. Booking, amenities, check-in, location, and more.">
```

**Step 2: Build FAQ accordion**

17 FAQ items in 3 sections (Booking, Building & Apartment Rules, Location). Use the exact Q&A content from `features/specs/S1-site-content-map.md`.

Reference: `webflow-reference.css` lines 5555-5610 (`.faq-arrow`, `.faq-set`, `.faq-right`, `.faq-left`)

**Step 3: Add FAQ accordion JS to main.js**

```js
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    item.classList.toggle('open');
  });
});
```

**Step 4: Verify all 17 FAQs expand/collapse**

**Step 5: Commit**

```bash
git add website/faq.html website/css/style.css website/js/main.js
git commit -m "feat: add FAQ page with accordion (17 questions)"
```

---

### Task 10: EN Secondary Pages — Contact, Rules, Data Policy

**Files:**
- Create: `website/contact-us.html`
- Create: `website/rules-and-policies.html`
- Create: `website/data-polices.html`
- Modify: `website/css/style.css`

**Step 1: Create contact-us.html**

Unique meta tags. Contact form (UI only, no submission logic — add `action="#"` placeholder). Address, phone, email, hours, Google Maps link. Include header + footer.

**Step 2: Create rules-and-policies.html**

Unique meta tags. Full rules content from the scraped content. Sections: Access, Behavior, Amenities, Capacity, Safety, Legal.

**Step 3: Create data-polices.html**

Unique meta tags. Full privacy policy content.

**Step 4: Add any page-specific CSS**

**Step 5: Verify all three pages**

**Step 6: Commit**

```bash
git add website/contact-us.html website/rules-and-policies.html website/data-polices.html website/css/style.css
git commit -m "feat: add contact, rules, and data policy pages"
```

---

### Task 11: EN Blog Pages — Tourist Guide + Posts

**Files:**
- Create: `website/santa-marta-and-sierra-nevada-tourist-guide.html`
- Create: `website/post/santa-marta-first-time-guide.html`
- Create: `website/post/aventuras-caminatas-sierra-nevada-santa-marta.html`
- Create: `website/category/activities.html`
- Create: `website/category/dinning.html`
- Create: `website/category/travel.html`
- Modify: `website/css/style.css`

**Step 1: Create tourist guide index page**

Lists 2 blog posts with thumbnails, titles, excerpts. Category filter links (Activities, Dining, Travel).

**Step 2: Create Santa Marta guide blog post**

Full content: Beaches, Historical Sites, Sierra Nevada Adventures, Activities, Dining, Nightlife, Practical Info, Accommodation section. Unique meta tags.

Reference for blog layout: `webflow-reference.css` lines 2353-2380 (`.content-section.blog-post`, `.content-section.blog`)

**Step 3: Create Sierra Nevada trekking blog post**

Full content: Overview, Ciudad Perdida Trek, Minca, Indigenous Communities, Short Treks, Practical Advice. Unique meta tags.

**Step 4: Create category filter pages**

Simple pages that show the blog posts filtered by category. Can be static HTML listing the relevant posts.

**Step 5: Verify all blog pages and links between them**

**Step 6: Commit**

```bash
git add website/santa-marta-and-sierra-nevada-tourist-guide.html website/post/ website/category/ website/css/style.css
git commit -m "feat: add tourist guide index, 2 blog posts, and category pages"
```

---

### Task 12: ES Landing Page (es/inicio.html)

**Files:**
- Create: `website/es/inicio.html`

**Step 1: Duplicate index.html to es/inicio.html**

- Change `lang="en"` to `lang="es"`
- Translate all meta tags to Spanish
- Translate all visible text content to Spanish (use the scraped Spanish content)
- Update nav links to Spanish URLs (`/es/contactanos`, `/es/preguntas-fecuentes`, etc.)
- Update language switcher to point to `/` (English)
- Update image paths (prepend `../` since we're in `/es/`)
- CSS and JS paths also need `../` prefix

**Step 2: Verify Spanish landing page renders identically to English (just translated)**

**Step 3: Commit**

```bash
git add website/es/inicio.html
git commit -m "feat: add Spanish landing page"
```

---

### Task 13: ES Secondary Pages

**Files:**
- Create: `website/es/contactanos.html`
- Create: `website/es/preguntas-fecuentes.html`
- Create: `website/es/reglas-y-politicas.html`
- Create: `website/es/habeas-data.html`
- Create: `website/es/guia-turistica.html`
- Create: `website/post-espanol/guia-viaje-santa-marta-playas-historia-aventura.html`
- Create: `website/post-espanol/explorando-la-sierra-nevada-de-santa-marta-aventuras-de-trekking-y-encuentros-con-comunidades-indigenas.html`

**Step 1: Create each Spanish page**

Mirror the corresponding English page structure but with:
- Spanish meta tags
- Spanish content (from scraped data)
- Spanish nav links
- Language switcher pointing to English equivalent
- Correct relative paths for CSS/JS/images

**Step 2: Verify all Spanish pages**

**Step 3: Commit**

```bash
git add website/es/ website/post-espanol/
git commit -m "feat: add all Spanish pages (landing, FAQ, contact, rules, blog)"
```

---

### Task 14: Favicon + Final Polish

**Files:**
- Copy: `favicon.ico` to `website/favicon.ico`
- Modify: all HTML files (verify favicon link)

**Step 1: Copy favicon**

```bash
cp /home/pablo/projects/sierra_and_sea_suite/favicon.ico /home/pablo/projects/sierra_and_sea_suite/website/favicon.ico
```

**Step 2: Cross-page link audit**

Verify every internal link works:
- EN ↔ ES language switcher links
- Nav links on every page
- Footer links
- Blog post links from index pages
- Category page links

**Step 3: Responsive audit**

Check each page at: 1440px, 991px, 767px, 479px widths.

**Step 4: Commit**

```bash
git add website/
git commit -m "feat: add favicon and complete cross-page link audit"
```

---

### Task 15: Local Server Test

**Step 1: Start local server**

```bash
cd /home/pablo/projects/sierra_and_sea_suite/website && npx serve . -p 3000
```

**Step 2: Verify all pages load**

Navigate through every page, check images load, navigation works, FAQ accordion works, responsive layout works.

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete static site copy of sierraseasuite.com"
```

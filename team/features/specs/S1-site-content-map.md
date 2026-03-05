# S1: Complete Site Content Map — sierraseasuite.com

## Overview
Full inventory of all pages, content, and assets on the current Webflow site. This is the reference for rebuilding as a static site.

## Complete Sitemap (20 pages)

### English Pages (10)

| # | URL | Type | Description |
|---|-----|------|-------------|
| 1 | `/` | Landing | Hero + booking form, 3 feature cards, location map, penthouse gallery (10+ photos), amenities, blog previews, footer |
| 2 | `/contact-us` | Page | Booking form (from/to dates + message), address, phone, email, map link |
| 3 | `/faq` | Page | 17 FAQ accordion items in 3 sections: Booking, Building/Apartment Rules, Location |
| 4 | `/rules-and-policies` | Page | Check-in/out, guest access, noise, amenities, capacity, safety, legal |
| 5 | `/data-polices` | Page | Privacy/cookie policy, data collection, user rights, GDPR |
| 6 | `/santa-marta-and-sierra-nevada-tourist-guide` | Blog index | 2 blog posts listed, categories: Activities, Dining, Travel |
| 7 | `/post/santa-marta-first-time-guide` | Blog post | Beaches, history, Sierra Nevada, activities, dining, nightlife, practical info |
| 8 | `/post/aventuras-caminatas-sierra-nevada-santa-marta` | Blog post | Sierra Nevada overview, Ciudad Perdida trek, Minca, indigenous communities, short treks |
| 9 | `/category/activities` | Category | Blog filter page |
| 10 | `/category/dinning` | Category | Blog filter page |
| 11 | `/category/travel` | Category | Blog filter page |
| 12 | `/log-in` | Auth | Login page (may not be needed for static) |

### Spanish Pages (9)

| # | URL | Type | Description |
|---|-----|------|-------------|
| 1 | `/es/inicio` | Landing | Same as English `/` but in Spanish, COP pricing ($400,000) |
| 2 | `/es/contactanos` | Page | Same as `/contact-us` in Spanish |
| 3 | `/es/preguntas-fecuentes` | Page | Same 17 FAQ items in Spanish |
| 4 | `/es/reglas-y-politicas` | Page | Same rules in Spanish |
| 5 | `/es/habeas-data` | Page | Colombian privacy policy (Habeas Data) |
| 6 | `/es/guia-turistica` | Blog index | 2 Spanish blog posts |
| 7 | `/post-espanol/guia-viaje-santa-marta-playas-historia-aventura` | Blog post | Spanish version of Santa Marta guide |
| 8 | `/post-espanol/explorando-la-sierra-nevada-de-santa-marta-aventuras-de-trekking-y-encuentros-con-comunidades-indigenas` | Blog post | Spanish version of Sierra Nevada guide |

## Shared Components (present on all pages)

### Header/Navigation
- Logo
- Nav links: Home, Contact, Location (#anchor), Apartment (#anchor), FAQ, Rules & Policies, Tourist Guide
- Language switcher (EN/ES)
- "Book Now" CTA button

### Footer
- Logo
- Nav links repeated
- Social: Facebook (`facebook.com/sierraseasuite`), Instagram (`instagram.com/sierraseasuite`)
- Booking: Airbnb (`airbnb.com/h/sierraseasuite`), VRBO (`vrbo.com/4219540`)
- Data Policy link

## External Links
- Airbnb: `https://airbnb.com/h/sierraseasuite`
- VRBO: `https://www.vrbo.com/4219540`
- Facebook: `https://www.facebook.com/sierraseasuite`
- Instagram: `https://www.instagram.com/sierraseasuite/`
- Google Maps: `https://maps.app.goo.gl/mGex7XxRWC6BLxzE7`

## Contact Info
- **Address**: Carrera 2 #107-31, Santa Marta, Colombia 470006
- **Phone**: +1 801-200-3527
- **Email**: info@sierrseasuite.com
- **Hours**: Monday–Friday, 9:00 AM – 5:00 PM

## Landing Page Sections (English `/`)
1. **Hero** — Large background image + booking form overlay
2. **Three Feature Cards** — Prime Location, Comfort & Relax, Explore Nature (icons + CTAs)
3. **Welcome Text** — "Enjoy the best vacation experience"
4. **Location Map** — Visual distances: Beach (2 min walk), Airport (15 min), Taganga, Old City, Tayrona
5. **Penthouse Gallery** — Grid of 10+ property photos, 64.8 m² apartment
6. **Amenities** — Swimming Pools, Exercise/Gym, Relax/Jacuzzi
7. **Tourist Guide Preview** — 2 blog post cards
8. **Footer**

## FAQ Content (17 questions, 3 sections)

### Booking (5)
1. How can I book? → Airbnb/VRBO, 2-night minimum
2. Guest restrictions? → Minors need parents, no pets
3. Hotel or vacation rental? → Vacation rental, full unit
4. Rental policy? → Contract required, ID, registered guests only
5. Refund policy? → 100% refund if cancelled 5+ days before

### Building & Apartment Rules (8)
6. Building rules? → No parties, quiet hours 10PM-8AM, no smoking, no pets
7. Check-in/out? → 3PM / 11AM, keyless entry
8. Amenities? → Wi-Fi, 2 smart TVs, kitchen, jacuzzi, AC, playard, games
9. Guest capacity? → 5 guests: 1 Queen bed, 1 small sofa bed, 1 Queen sofa bed, 1 playard
10. Child-friendly? → Yes but 17th floor, supervision required
11. Linens/towels? → Fresh linens, 1 body towel + 1 beach towel per guest
12. Laundry? → External service, pick-up/delivery
13. Kitchen? → Full fridge, 2-burner stove, plates, utensils, pots

### Location (4)
14. Airport distance? → Simón Bolívar, 15 min, ~$35,000 COP taxi
15. Nearby activities? → Bello Horizonte Beach (2 min), Zazué Plaza (5 min)
16. What building? → Porto Horizonte, near Hilton/Mercure/Irotama
17. Nearest grocery? → Zazué Plaza (5 min), small market 2 blocks

## Assets to Extract
- [ ] Logo (multiple versions — light/dark)
- [ ] All property photos (10+ gallery images)
- [ ] Feature card icons
- [ ] Location map graphic
- [ ] Amenity images (pools, gym, jacuzzi)
- [ ] Blog post images
- [ ] Favicon
- [ ] Background/hero images

## Notes
- `/log-in` page from sitemap — probably not needed for static site
- Blog categories (`/category/*`) are filter views, not separate content
- Spanish site mirrors English exactly in structure, different content for pricing (COP vs USD)
- Contact form currently submits to Webflow — will need alternative (Formspree, Netlify Forms, etc.)
- Booking form redirects to Airbnb/VRBO — just external links

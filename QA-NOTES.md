# QA notes — 22 September 2026

## Professional redesign completed

- Removed the accidental visible `html` text from all 50 HTML pages.
- Rebuilt the homepage hero into a premium photo-led layout using local Tanzania imagery.
- Added a planning-confidence strip and improved service, region, safari, tour, hotel and ticket cards.
- Improved responsive typography, mobile navigation spacing, card stacking and small-screen booking form behavior.
- Refined light/dark themes, focus states, filters, buttons, footer and booking form styling.
- Added multi-image galleries to destination/hotel detail pages when additional images are available.
- Added graceful image fallbacks so a failed remote image does not leave a broken-image icon.
- Gently enhanced the saved local photos for contrast, colour and sharpness while preserving the original subjects.
- Corrected the Arusha City & Heritage primary image so it now uses Arusha Clock Tower rather than a park giraffe image.

## Automated checks

- Catalog: 27 destinations, 21 hotels, 6 service types
- Unique primary images: 48/48
- Local photos checked: 20
- HTML pages checked: 50
- Local page/script/style/image references: checked
- Duplicate HTML IDs: checked
- JavaScript syntax: checked
- CSS custom properties: checked
- Duplicate primary destination/hotel images: checked

## Result

No blocking local-code or local-link errors were found in the automated QA pass.

Remote third-party photos and Google Maps/Fonts still require an internet connection. The site includes image fallbacks, but the exact availability of third-party URLs can change outside the project.

## Persistent header upgrade — 22 Sep 2026
- Replaced browser-dependent sticky behavior with a robust fixed/persistent site header on all pages.
- Header compacts after scrolling while remaining visible for navigation and booking access.
- Added a subtle page-scroll progress accent below the header.
- Improved desktop navigation hierarchy, active states, focus states and Book now emphasis.
- Rebuilt mobile/tablet navigation as an accessible touch-friendly dropdown panel.
- Added Escape/outside-click/resize menu closing behavior.
- Added responsive sizing down to narrow 390px screens and short landscape phone viewports.
- Homepage section navigation updates as visitors move through Safaris, Tours, Locations, Hotels and Tickets.
- Static QA: 50 pages checked; 0 missing local links/assets; 0 duplicate IDs; JavaScript syntax checks passed.

## 2026-09-22 performance + duplicate-image QA
- Footer developer credit updated on all 50 HTML pages to Isaac Sabuni with 0746584214.
- Public notification privacy preserved; the owner notification address is not embedded in public HTML/JS/CSS/config.
- Local full-size WebP photos re-encoded efficiently; total dropped from 4,298,030 bytes to 3,056,702 bytes.
- Added 20 lightweight 720px WebP card thumbnails so cards avoid loading full-size local photos.
- Homepage LCP hero image is preloaded and kept local.
- Catalog gallery sources de-duplicated globally; 48 item primary photos remain unique.
- Homepage image picker prevents repeated content photos across hero, regions, safari, tour and hotel cards.
- Detail galleries show each photo once at a time by swapping the selected thumbnail with the main image.
- 50 HTML pages checked: no missing local links/assets, no buttons missing type attributes.
- JavaScript syntax and vercel.json validated.
- GITHUB-UPDATE.md added for simple replacement deployment.

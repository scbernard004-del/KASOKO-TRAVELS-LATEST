# Kasoko Safaris & Tours

Static, mobile-first Arusha-based Tanzania travel site for GitHub and Vercel. It covers safaris from Arusha to Serengeti, Ngorongoro, Tarangire and Manyara; tours and excursions in Arusha, Manyara, Tanga and Zanzibar; city, cultural and coast experiences; hotels and lodges; flights, buses, ferries, trains, transfers and combined trips.

## Run locally

Open `index.html` for a static content preview, or serve this folder with any simple static server. The booking form falls back to a WhatsApp message or downloadable draft until the API environment variables are configured.

## Private booking + interaction notifications

The website sends completed booking requests and selected high-value interactions through private Vercel API routes. The owner's alert email is stored only in Google Apps Script Script Properties, never in public browser code.

Set `BOOKING_WEBHOOK_URL` to the HTTPS Google Apps Script `/exec` endpoint and `BOOKING_WEBHOOK_SECRET` to the same private secret used by `google-apps-script-alerts-template.txt`. Follow `NOTIFICATIONS-SETUP.md` for the one-time activation. The site never claims a room, ticket or itinerary is confirmed until Kasoko checks live availability.

## Editing content

- Edit destinations and hotels in `catalog.js`.
- Edit English and Kiswahili interface text in `translations.js`.
- Replace saved card images in `assets/photos/` and update `photo-sources.json`.
- Keep the detail page filename and catalog `id` in sync.

## Contacts

0789 515 769 · 0744 355 769 · 0762 917 519

# Kasoko Safaris & Tours

Static, mobile-first Arusha-based Tanzania travel site for GitHub and Vercel. It covers safaris from Arusha to Serengeti, Ngorongoro, Tarangire and Manyara; tours and excursions in Arusha, Manyara, Tanga and Zanzibar; city, cultural and coast experiences; hotels and lodges; flights, buses, ferries, trains, transfers and combined trips.

## Run locally

Open `index.html` for a static content preview, or serve this folder with any simple static server. The booking form falls back to a WhatsApp message or downloadable draft until the API environment variables are configured.

## Booking endpoint

Set `BOOKING_WEBHOOK_URL` to an HTTPS Google Apps Script `/exec` endpoint and `BOOKING_WEBHOOK_SECRET` to the same private secret used by `google-apps-script-alerts-template.txt`. The endpoint must return `{ "ok": true, "status": "request_received", "reference": "KST-..." }`. The site never claims a room, ticket or itinerary is confirmed until Kasoko checks live availability.

## Editing content

- Edit destinations and hotels in `catalog.js`.
- Edit English and Kiswahili interface text in `translations.js`.
- Replace saved card images in `assets/photos/` and update `photo-sources.json`.
- Keep the detail page filename and catalog `id` in sync.

## Contacts

0789 515 769 · 0744 355 769 · 0762 917 519

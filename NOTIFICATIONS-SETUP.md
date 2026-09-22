# Private email notifications

Kasoko now has two private notification paths:

1. **Completed booking / order request** — sends the complete request details to the owner and saves the request in a private `Bookings` Google Sheet tab.
2. **High-value website interaction** — sends an alert when a visitor clicks a booking CTA, starts the booking form, taps a phone number, or opens WhatsApp. These are also saved in a private `Interactions` tab.

The owner's email address is **not present in any public HTML, CSS, JavaScript, API response, or browser configuration**. Put the destination email only in Google Apps Script **Script Properties** under `ALERT_EMAIL`.

## One-time private activation

1. Create a private Google Sheet.
2. Go to Google Apps Script and create a project.
3. Copy the full contents of `google-apps-script-alerts-template.txt` into the Apps Script editor.
4. In **Project Settings → Script properties**, add:
   - `SHEET_ID` = the Google Sheet ID
   - `ALERT_EMAIL` = the Gmail address that should receive alerts
   - `WEBHOOK_SECRET` = a long random secret (32+ characters)
5. Run `setupSheets()` once and approve permissions.
6. **Deploy → New deployment → Web app**. Execute as **Me** and allow **Anyone**.
7. Copy the deployment URL ending in `/exec`.
8. In **Vercel → Project → Settings → Environment Variables**, add:
   - `BOOKING_WEBHOOK_URL` = the `/exec` URL
   - `BOOKING_WEBHOOK_SECRET` = the exact same private secret
9. Redeploy the Vercel project.

Do not put the owner email or the secret in `config.js`, HTML files, GitHub repository secrets-as-files, or any browser-side code.

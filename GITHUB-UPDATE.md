# Updating Kasoko on GitHub

This package keeps the same static-site structure, so you can replace the existing repository files directly.

1. Open the existing Kasoko GitHub repository.
2. Upload the **contents of this `kasoko-travels` folder** to the repository root, replacing files with the same names.
3. Make sure the `api` and `assets` folders are uploaded too.
4. Commit the changes.
5. Vercel will redeploy automatically when the repository is connected.

Do **not** put the private notification email, webhook URL, or webhook secret in these public files. Keep the existing Vercel environment variables from the notification setup.

If GitHub's browser uploader is awkward with many files, delete the old `assets` folder first, then upload the new `assets` folder and the root files.

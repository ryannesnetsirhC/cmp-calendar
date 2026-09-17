# CMP Key Dates Calendar

A simple, single-page calendar site for sharing important recurring dates
(board meetings, finance committee meetings, staffing model releases, SpEd
sheet availability, etc.) with a client. No build tools or backend —
just static HTML/CSS/JS.

## Files

- `index.html` — the page structure
- `style.css` — all styling and colors (CSS variables at the top make it
  easy to swap in exact brand colors)
- `script.js` — renders the calendar grid and the "Upcoming Dates" list
- `events.js` — **the only file you need to edit** to add/change dates
- `assets/logo-placeholder.svg` — placeholder logo; swap in the real one

## Updating the dates

Open `events.js` in VS Code. Each event looks like this:

```js
{ date: "2026-10-15", title: "SpEd Sheet Ready", category: "sped", note: "SpEd contracted services recon sheet published" },
```

Add, edit, or delete entries as needed. `category` controls the color and
must be one of the keys in the `CATEGORIES` object at the top of the same
file (`board`, `finance`, `staffing`, `sped`, or `other` — you can rename
labels/colors there too, or add new categories).

The sample dates currently in the file are placeholders — replace them
with your real dates before sharing the link with anyone.

## Swapping in the real CMP logo

Replace `assets/logo-placeholder.svg` with your logo file (PNG, SVG, or
JPG all work), then update this line in `index.html` to match the
filename:

```html
<img src="assets/logo-placeholder.svg" alt="California Montessori Project" class="brand-logo" />
```

## Previewing locally

Just open `index.html` in a browser — no server required. (In VS Code,
the "Live Server" extension gives you auto-refresh while editing.)

## Publishing with GitHub Pages

1. Create a new repository on GitHub (e.g. `cmp-calendar`) — keep it
   **public** so Pages can serve it for free, unless your GitHub plan
   supports Pages on private repos.
2. From this project folder, push it up:
   ```bash
   git remote add origin https://github.com/<your-username>/cmp-calendar.git
   git branch -M main
   git push -u origin main
   ```
   (This folder is already a git repo with an initial commit, so you can
   skip straight to `git remote add` and `git push`.)
3. On GitHub, go to the repo's **Settings → Pages**.
4. Under "Build and deployment," set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`, then **Save**.
5. GitHub will publish the site at:
   `https://<your-username>.github.io/cmp-calendar/`
   (takes a minute or two the first time). That's the link you can share
   with your client.

To update the site later: edit `events.js`, then
```bash
git add events.js
git commit -m "Update calendar dates"
git push
```
GitHub Pages picks up the change automatically within a minute or two.

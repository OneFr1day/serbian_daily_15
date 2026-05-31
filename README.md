# Serbian Daily 15

Personal mobile-first PWA for learning Serbian in short daily sessions.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages deployment

This project includes `.github/workflows/deploy.yml`.

1. Upload the project files to the repository root.
2. Go to **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main`.
5. Wait for the green check in **Actions**.
6. Open the Pages URL on Android Chrome.

## Install on Android Chrome

After the site loads, Chrome should show the in-app button:

**Установить на главный экран → Добавить**

The button disappears after installation. You can also use Chrome menu `⋮ → Add to Home screen`.

## Important GitHub Pages fix

The manifest is served from the app root:

```html
<link rel="manifest" href="%BASE_URL%manifest.webmanifest" />
```

The manifest uses:

```json
"start_url": "./",
"scope": "./"
```

This avoids the installed app opening `/` and showing GitHub Pages 404.

## Progress storage

Progress is stored locally in the browser via `localStorage`. It survives app updates on the same domain.

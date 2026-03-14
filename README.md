# Baulko Bell Times

Baulko Bell Times is a React + Vite app for viewing school bell times, managing your timetable, and using study tools.

## Commands

- `npm run dev`: Start the local Vite dev server.
- `npm run build`: Build the website into `dist/`.
- `npm run build:extension`: Build the website and package a Chrome extension into `dist-extension/`.
- `npm run lint`: Run ESLint.

## Chrome Extension Workflow

Whenever you update the website, run:

```bash
npm run build:extension
```

This command automatically:

1. Builds the latest website.
2. Copies the build into `dist-extension/`.
3. Generates `dist-extension/manifest.json`.
4. Removes unsupported analytics script tags from the extension popup HTML.

To load it in Chrome:

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click **Load unpacked**.
4. Select the `dist-extension/` folder.

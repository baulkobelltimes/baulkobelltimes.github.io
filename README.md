# Baulko Bell Times

Baulko Bell Times is a React + Vite app for viewing school bell times, managing your timetable, and using study tools.

## Commands

- `npm run dev`: Start the local Vite dev server.
- `npm run build`: Build the website into `dist/`.
- `npm run build:extension`: Build the website and package a Chrome extension into `dist-extension/`.
- `npm run release:extension`: Build the extension and generate a versioned upload ZIP in `artifacts/`.
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

## Release Workflow

When you are preparing something that will actually be uploaded or attached to a GitHub release, use:

```bash
npm run release:extension
```

This command:

1. Rebuilds the app.
2. Regenerates `dist-extension/`.
3. Uses the `version` in `package.json` as the Chrome extension version.
4. Creates a versioned ZIP in `artifacts/`.

Important release rule: Chrome Web Store versions must be numeric only, with 1 to 4 dot-separated numbers, for example `1.0.0` or `1.2.3.4`.
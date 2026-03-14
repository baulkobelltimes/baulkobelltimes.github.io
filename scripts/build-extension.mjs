import { execSync } from 'node:child_process';
import { deflateSync } from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const extensionOutDir = path.join(rootDir, 'dist-extension');
const extensionOverlayDir = path.join(rootDir, 'extension');

// ─── Configurable values ─────────────────────────────────────────────────────
const POPUP_WIDTH = 440;          // px – Chrome popup max is 800px
const POPUP_MIN_HEIGHT = 560;     // px
const EXTENSION_VERSION = '1.0.0';
const ICON_SIZES = [16, 32, 48, 128];
const ICON_COLOR = [98, 0, 234];  // #6200ea

// ─── Injected style ──────────────────────────────────────────────────────────
// Sets the popup dimensions (with !important so they win over any bundled CSS)
// and overrides spacing/font-sizes for a compact layout.
const EXTENSION_POPUP_STYLE = `<style id="bbt-extension-popup-size">
  html { width: ${POPUP_WIDTH}px !important; overflow-x: hidden; }
  body { width: ${POPUP_WIDTH}px !important; min-width: ${POPUP_WIDTH}px !important;
         min-height: ${POPUP_MIN_HEIGHT}px !important; margin: 0; overflow-x: hidden; }
  #root { width: 100% !important; }
  .app { width: 100% !important; min-width: ${POPUP_WIDTH}px !important; }

  /* Compact layout overrides */
  .main-content   { width: 100% !important; max-width: none !important; padding: 10px !important; box-sizing: border-box; }
  .greeting       { font-size: 1.2rem !important; margin-bottom: 0.5rem !important; }
  .layout,
  .schedule-stack { gap: 0.5rem !important; }
  .layout.with-sidebar { grid-template-columns: 1fr !important; }
  .card           { padding: 0.8rem !important; }
  .card-title     { font-size: 0.95rem !important; }
  .card-header    { margin-bottom: 0.5rem !important; }
  .schedule-header { margin-bottom: 0.5rem !important; gap: 0.4rem !important; }
  .schedule-title { font-size: 1rem !important; }
  .countdown      { padding: 0.5rem 0.75rem !important; margin: 0.5rem 0 !important; }
  .countdown-time { font-size: 1.75rem !important; }
  .countdown-details { font-size: 0.85rem !important; margin-top: 0.25rem !important; }
  .period-list    { gap: 0.25rem !important; }
  .period-item    { padding: 0.4rem 0.65rem !important; }
  .period-name    { font-size: 0.875rem !important; }
  .period-time    { font-size: 0.825rem !important; }
  .timer-display  { font-size: 2rem !important; }
  .sidebar        { gap: 0.5rem !important; }
  .quick-link     { padding: 0.4rem 0.65rem !important; font-size: 0.85rem !important; }
  .quick-links-list { gap: 0.25rem !important; }
  .footer         { padding: 0.35rem !important; }
  .footer a       { font-size: 0.72rem !important; }
</style>`;

// ─── PNG icon generation (pure Node.js, no extra dependencies) ───────────────

function getWebsiteFaviconSvg() {
  const sourceHtmlPath = path.join(rootDir, 'index.html');
  if (!fs.existsSync(sourceHtmlPath)) return null;

  const html = fs.readFileSync(sourceHtmlPath, 'utf8');
  const faviconMatch = html.match(/<link[^>]*rel=["']icon["'][^>]*href=["'](data:image\/svg\+xml,[^"']+)["'][^>]*>/i);
  if (!faviconMatch?.[1]) return null;

  const encodedSvg = faviconMatch[1].replace('data:image/svg+xml,', '');
  try {
    return decodeURIComponent(encodedSvg);
  } catch {
    return null;
  }
}

/** Rasterise the site's bell icon SVG shape into an RGBA pixel buffer. */
function generateBellPng(size) {
  const [R, G, B] = ICON_COLOR;
  const buf = Buffer.alloc(size * size * 4, 0); // transparent by default
  const s = size / 100;

  function fillRect(xn1, yn1, xn2, yn2) {
    const x1 = Math.max(0, Math.round(xn1 * s));
    const y1 = Math.max(0, Math.round(yn1 * s));
    const x2 = Math.min(size - 1, Math.round(xn2 * s));
    const y2 = Math.min(size - 1, Math.round(yn2 * s));
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        const i = (y * size + x) * 4;
        buf[i] = R; buf[i + 1] = G; buf[i + 2] = B; buf[i + 3] = 255;
      }
    }
  }

  function fillCircle(cxn, cyn, rn) {
    const cx = cxn * s; const cy = cyn * s; const r = rn * s;
    for (let y = Math.max(0, Math.floor(cy - r)); y <= Math.min(size - 1, Math.ceil(cy + r)); y++) {
      for (let x = Math.max(0, Math.floor(cx - r)); x <= Math.min(size - 1, Math.ceil(cx + r)); x++) {
        if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) {
          const i = (y * size + x) * 4;
          buf[i] = R; buf[i + 1] = G; buf[i + 2] = B; buf[i + 3] = 255;
        }
      }
    }
  }

  // All coordinates are in the original [0..100] SVG viewBox space.
  // Bell body – tapered upper section (y 15→40, width 0→50)
  const step = Math.max(0.5, 1 / s);
  for (let yn = 15; yn <= 40; yn += step) {
    const t = (yn - 15) / 25;
    fillRect(50 - 25 * t, yn, 50 + 25 * t, yn + step);
  }
  // Bell body – straight section
  fillRect(25, 40, 75, 65);
  // Bell flare – expanding bottom (y 65→75, width 50→70)
  for (let yn = 65; yn <= 75; yn += step) {
    const t = (yn - 65) / 10;
    fillRect(25 - 10 * t, yn, 75 + 10 * t, yn + step);
  }
  // Bell base / clapper housing
  fillRect(40, 75, 60, 85);
  // Top cap dot
  fillCircle(50, 10, 5);

  return encodePng(buf, size, size);
}

function encodePng(pixels, w, h) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  const rows = [];
  for (let y = 0; y < h; y++) {
    rows.push(Buffer.from([0])); // filter: None
    rows.push(pixels.slice(y * w * 4, (y + 1) * w * 4));
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(Buffer.concat(rows))),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function pngChunk(type, data) {
  const typeB = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(pngCrc32(Buffer.concat([typeB, data])), 0);
  return Buffer.concat([len, typeB, data, crc]);
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function pngCrc32(data) {
  let c = 0xffffffff;
  for (const byte of data) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function generateExtensionIcons(outputDir) {
  const iconsDir = path.join(outputDir, 'icons');
  fs.mkdirSync(iconsDir, { recursive: true });

  const iconPaths = {};
  const faviconSvg = getWebsiteFaviconSvg();
  const sourceSvgPath = path.join(iconsDir, 'icon-source.svg');

  if (faviconSvg && process.platform === 'darwin') {
    fs.writeFileSync(sourceSvgPath, `${faviconSvg}\n`);

    try {
      for (const size of ICON_SIZES) {
        const rel = `icons/icon${size}.png`;
        const outPath = path.join(outputDir, rel);
        execSync(`sips -s format png -z ${size} ${size} "${sourceSvgPath}" --out "${outPath}"`, {
          stdio: 'ignore',
        });
        iconPaths[size] = rel;
      }
    } catch {
      // Fall through to pure-Node fallback for any missing icon files.
    } finally {
      fs.rmSync(sourceSvgPath, { force: true });
    }
  }

  for (const size of ICON_SIZES) {
    if (iconPaths[size]) continue;
    const rel = `icons/icon${size}.png`;
    fs.writeFileSync(path.join(outputDir, rel), generateBellPng(size));
    iconPaths[size] = rel;
  }

  return iconPaths;
}

function writeExtensionBootstrap(outputDir, appEntrySrc) {
  const normalizedEntry = appEntrySrc.startsWith('/')
    ? `.${appEntrySrc}`
    : appEntrySrc.startsWith('./')
      ? appEntrySrc
      : `./${appEntrySrc}`;

  const bootstrapCode = `const APP_ENTRY = ${JSON.stringify(normalizedEntry)};

const existingRaw = localStorage.getItem('tiles');
let existing = {};

try {
  existing = existingRaw ? JSON.parse(existingRaw) : {};
} catch {
  existing = {};
}

localStorage.setItem('tiles', JSON.stringify({
  quickLinks: false,
  quote: false,
  timer: typeof existing.timer === 'boolean' ? existing.timer : false,
  examTracker: typeof existing.examTracker === 'boolean' ? existing.examTracker : false,
  notepad: typeof existing.notepad === 'boolean' ? existing.notepad : false
}));

void import(APP_ENTRY);
`;

  fs.writeFileSync(path.join(outputDir, 'extension-bootstrap.js'), bootstrapCode);
}

// ─── HTML processing ──────────────────────────────────────────────────────────

function sanitizeIndexHtml(html) {
  let cleaned = html
    .replace(/<!--\s*Cloudflare Web Analytics\s*-->[\s\S]*?<!--\s*End Cloudflare Web Analytics\s*-->/gi, '')
    .replace(/<script[^>]+static\.cloudflareinsights\.com\/beacon\.min\.js[^>]*><\/script>/gi, '');

  // Remove any previously-injected extension style so we always start clean.
  cleaned = cleaned.replace(/<style id="bbt-extension-popup-size">[\s\S]*?<\/style>\s*/g, '');

  // Fix the viewport meta so Chrome respects the CSS width we set.
  if (/<meta name="viewport"[^>]*>/i.test(cleaned)) {
    cleaned = cleaned.replace(
      /<meta name="viewport"[^>]*>/i,
      `<meta name="viewport" content="width=${POPUP_WIDTH}, initial-scale=1">`,
    );
  } else {
    cleaned = cleaned.replace('</head>', `  <meta name="viewport" content="width=${POPUP_WIDTH}, initial-scale=1">\n  </head>`);
  }

  // Inject compact + sizing styles.
  cleaned = cleaned.replace('</head>', `  ${EXTENSION_POPUP_STYLE}\n  </head>`);

  // Remove any old inline init script (from a previous build run).
  cleaned = cleaned.replace(/<script id="bbt-extension-init">[\s\S]*?<\/script>\s*/g, '');
  cleaned = cleaned.replace(/<script[^>]*src=["']\/?init-extension\.js["'][^>]*><\/script>\s*/g, '');
  cleaned = cleaned.replace(/<script[^>]*src=["']\.?\/?extension-bootstrap\.js["'][^>]*><\/script>\s*/g, '');

  return `${cleaned.trim()}\n`;
}

function injectBootstrapModule(html, outputDir) {
  const moduleEntryRegex = /<script\s+type="module"[^>]*src="([^"]+)"[^>]*><\/script>/i;
  const moduleMatch = html.match(moduleEntryRegex);

  if (!moduleMatch) {
    return html;
  }

  const appEntrySrc = moduleMatch[1];
  writeExtensionBootstrap(outputDir, appEntrySrc);

  return html.replace(
    moduleEntryRegex,
    '<script type="module" src="./extension-bootstrap.js"></script>'
  );
}

// ─── Manifest ─────────────────────────────────────────────────────────────────

function buildManifest(iconPaths) {
  const manifest = {
    manifest_version: 3,
    name: 'Baulko Bell Times',
    short_name: 'Bell Times',
    version: EXTENSION_VERSION,
    description: 'Quick access to Baulko Bell Times from your Chrome toolbar.',
    action: {
      default_title: 'Baulko Bell Times',
      default_popup: 'index.html',
    },
  };

  if (iconPaths && Object.keys(iconPaths).length > 0) {
    manifest.icons = { ...iconPaths };
    manifest.action.default_icon = { ...iconPaths };
  }

  return manifest;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log('Building web app...');
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

  if (!fs.existsSync(distDir)) {
    throw new Error('Web build output was not found in dist/.');
  }

  console.log('Preparing dist-extension/...');
  fs.rmSync(extensionOutDir, { recursive: true, force: true });
  fs.mkdirSync(extensionOutDir, { recursive: true });
  fs.cpSync(distDir, extensionOutDir, { recursive: true });

  const overlayExists = fs.existsSync(extensionOverlayDir);
  const overlayHasFiles = overlayExists && fs.readdirSync(extensionOverlayDir).length > 0;

  if (overlayHasFiles) {
    console.log('Applying extension overlay files...');
    fs.cpSync(extensionOverlayDir, extensionOutDir, { recursive: true });
  }

  // Generate extension icons from the site's favicon shape where possible.
  const iconPaths = generateExtensionIcons(extensionOutDir);
  console.log(`Icons generated: ${ICON_SIZES.map(s => `${s}x${s}`).join(', ')}`);

  const indexPath = path.join(extensionOutDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    const html = fs.readFileSync(indexPath, 'utf8');
    const sanitizedHtml = sanitizeIndexHtml(html);
    const bootstrapHtml = injectBootstrapModule(sanitizedHtml, extensionOutDir);
    fs.writeFileSync(indexPath, bootstrapHtml);
  }

  const manifest = buildManifest(iconPaths);
  fs.writeFileSync(
    path.join(extensionOutDir, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`
  );

  console.log(`Chrome extension build complete: dist-extension/ (v${EXTENSION_VERSION})`);
}

main();

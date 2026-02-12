const DARK_BASE_BG = '#121212';
const DARK_BASE_CARD = '#1e1e1e';
const DARK_BASE_BORDER = '#333333';
const DARK_TEXT = '#ffffff';

const normalizeHex = (hex) => {
  if (!hex || typeof hex !== 'string') return '#000000';
  const value = hex.trim();
  if (!value.startsWith('#')) return '#000000';
  if (value.length === 4) {
    const r = value[1];
    const g = value[2];
    const b = value[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  if (value.length === 7) return value.toLowerCase();
  return '#000000';
};

const hexToRgb = (hex) => {
  const v = normalizeHex(hex);
  return {
    r: parseInt(v.slice(1, 3), 16),
    g: parseInt(v.slice(3, 5), 16),
    b: parseInt(v.slice(5, 7), 16)
  };
};

const rgbToHex = ({ r, g, b }) => {
  const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
  const to2 = (n) => clamp(n).toString(16).padStart(2, '0');
  return `#${to2(r)}${to2(g)}${to2(b)}`;
};

const mixHex = (hexA, hexB, t) => {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const mix = (x, y) => x + (y - x) * t;
  return rgbToHex({
    r: mix(a.r, b.r),
    g: mix(a.g, b.g),
    b: mix(a.b, b.b)
  });
};

const createDarkFromLight = (light) => {
  const background = mixHex(DARK_BASE_BG, light['--background-color'], 0.12);
  const card = mixHex(DARK_BASE_CARD, light['--card-background'], 0.08);
  const border = mixHex(DARK_BASE_BORDER, light['--primary-color'], 0.15);

  return {
    ...light,
    '--background-color': background,
    '--card-background': card,
    '--text-color': DARK_TEXT,
    '--border-color': border
  };
};

const createTheme = (light) => ({
  light,
  dark: createDarkFromLight(light)
});

export const themePalettes = {
  default: {
    light: {
      '--primary-color': '#6200ea',
      '--primary-rgb': '98, 0, 234',
      '--background-color': '#f9f9f9',
      '--card-background': '#fff',
      '--text-color': '#333',
      '--border-color': '#ddd'
    },
    dark: {
      '--primary-color': '#bb86fc',
      '--primary-rgb': '187, 134, 252',
      '--background-color': '#121212',
      '--card-background': '#1e1e1e',
      '--text-color': '#ffffff',
      '--border-color': '#2d2d2d'
    }
  },
  light: createTheme({
    '--primary-color': '#1976d2',
    '--primary-rgb': '25, 118, 210',
    '--background-color': '#ffffff',
    '--card-background': '#f5f5f5',
    '--text-color': '#212121',
    '--border-color': '#e0e0e0'
  }),
  purple: createTheme({
    '--primary-color': '#9c27b0',
    '--primary-rgb': '156, 39, 176',
    '--background-color': '#f3e5f5',
    '--card-background': '#fff',
    '--text-color': '#4a148c',
    '--border-color': '#e1bee7'
  }),
  green: createTheme({
    '--primary-color': '#2e7d32',
    '--primary-rgb': '46, 125, 50',
    '--background-color': '#f1f8e9',
    '--card-background': '#fff',
    '--text-color': '#1b5e20',
    '--border-color': '#c8e6c9'
  }),
  ocean: createTheme({
    '--primary-color': '#0277bd',
    '--primary-rgb': '2, 119, 189',
    '--background-color': '#e1f5fe',
    '--card-background': '#fff',
    '--text-color': '#01579b',
    '--border-color': '#b3e5fc'
  }),
  sunset: createTheme({
    '--primary-color': '#f57c00',
    '--primary-rgb': '245, 124, 0',
    '--background-color': '#fff3e0',
    '--card-background': '#fff',
    '--text-color': '#e65100',
    '--border-color': '#ffe0b2'
  }),
  minimal: {
    light: {
      '--primary-color': '#424242',
      '--primary-rgb': '66, 66, 66',
      '--background-color': '#fafafa',
      '--card-background': '#fff',
      '--text-color': '#212121',
      '--border-color': '#eeeeee'
    },
    dark: {
      '--primary-color': '#888888',
      '--primary-rgb': '136, 136, 136',
      '--background-color': '#121212',
      '--card-background': '#1e1e1e',
      '--text-color': '#ffffff',
      '--border-color': '#2d2d2d'
    }
  },
  retro: createTheme({
    '--primary-color': '#d32f2f',
    '--primary-rgb': '211, 47, 47',
    '--background-color': '#ffebee',
    '--card-background': '#fff',
    '--text-color': '#b71c1c',
    '--border-color': '#ffcdd2'
  }),
  forest: createTheme({
    '--primary-color': '#004d40',
    '--primary-rgb': '0, 77, 64',
    '--background-color': '#e0f2f1',
    '--card-background': '#fff',
    '--text-color': '#00695c',
    '--border-color': '#b2dfdb'
  }),
  candy: createTheme({
    '--primary-color': '#ec407a',
    '--primary-rgb': '236, 64, 122',
    '--background-color': '#fce4ec',
    '--card-background': '#fff',
    '--text-color': '#c2185b',
    '--border-color': '#f8bbd0'
  }),
  coffee: createTheme({
    '--primary-color': '#795548',
    '--primary-rgb': '121, 85, 72',
    '--background-color': '#efebe9',
    '--card-background': '#fff',
    '--text-color': '#4e342e',
    '--border-color': '#d7ccc8'
  }),
  mint: createTheme({
    '--primary-color': '#00bfa5',
    '--primary-rgb': '0, 191, 165',
    '--background-color': '#e0f2f1',
    '--card-background': '#fff',
    '--text-color': '#00897b',
    '--border-color': '#b2dfdb'
  }),
  coral: createTheme({
    '--primary-color': '#ff7043',
    '--primary-rgb': '255, 112, 67',
    '--background-color': '#fbe9e7',
    '--card-background': '#fff',
    '--text-color': '#e64a19',
    '--border-color': '#ffccbc'
  }),
  lavender: createTheme({
    '--primary-color': '#7e57c2',
    '--primary-rgb': '126, 87, 194',
    '--background-color': '#ede7f6',
    '--card-background': '#fff',
    '--text-color': '#512da8',
    '--border-color': '#d1c4e9'
  })
};

export const THEME_MODE = {
  light: 'light',
  dark: 'dark'
};


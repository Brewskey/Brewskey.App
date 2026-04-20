// Lightweight color helpers that replace the bits of `tinycolor2` we used.
// Inputs are hex strings (`#rgb`, `#rrggbb`, or `rrggbb`).

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

// Parse a `#rgb` / `#rrggbb` / `rrggbb` string to integer RGB components.
const parseHexColor = (hex: string): [number, number, number] | null => {
  let value = hex.replace(/^#/, '');
  if (value.length === 3) {
    value = value
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (value.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(value)) {
    return null;
  }
  const num = parseInt(value, 16);
  return [
    Math.floor(num / 65536) % 256,
    Math.floor(num / 256) % 256,
    num % 256,
  ];
};

// Standard HSL conversion. Returns h in [0,360), s/l in [0,1].
const rgbToHsl = (
  r: number,
  g: number,
  b: number,
): [number, number, number] => {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rN:
        h = (gN - bN) / d + (gN < bN ? 6 : 0);
        break;
      case gN:
        h = (bN - rN) / d + 2;
        break;
      default:
        h = (rN - gN) / d + 4;
    }
    h *= 60;
  }
  return [h, s, l];
};

const hueToRgb = (p: number, q: number, t: number): number => {
  let tNorm = t;
  if (tNorm < 0) {
    tNorm += 1;
  }
  if (tNorm > 1) {
    tNorm -= 1;
  }
  if (tNorm < 1 / 6) {
    return p + (q - p) * 6 * tNorm;
  }
  if (tNorm < 1 / 2) {
    return q;
  }
  if (tNorm < 2 / 3) {
    return p + (q - p) * (2 / 3 - tNorm) * 6;
  }
  return p;
};

const hslToRgb = (
  h: number,
  s: number,
  l: number,
): [number, number, number] => {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hN = h / 360;
  return [
    Math.round(hueToRgb(p, q, hN + 1 / 3) * 255),
    Math.round(hueToRgb(p, q, hN) * 255),
    Math.round(hueToRgb(p, q, hN - 1 / 3) * 255),
  ];
};

const toHex = (n: number): string =>
  clamp(n, 0, 255).toString(16).padStart(2, '0');

// Returns true when the perceived brightness suggests light text on the color
// would be hard to read (matches tinycolor2's `isLight()` threshold of 128).
export const isLightColor = (hex: string): boolean => {
  const rgb = parseHexColor(hex);
  if (!rgb) {
    return true;
  }
  const [r, g, b] = rgb;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness >= 128;
};

// Replacement for `tinycolor(hex).darken(amount).toString()`. `amount` is in
// percentage points (0-100), matching tinycolor2's API.
export const darkenHex = (hex: string, amount: number): string => {
  const rgb = parseHexColor(hex);
  if (!rgb) {
    return hex;
  }
  const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
  const newL = clamp(l - amount / 100, 0, 1);
  const [r, g, b] = hslToRgb(h, s, newL);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

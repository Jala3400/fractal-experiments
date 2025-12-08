export type FractalDef = {
  id: string;
  label?: string;
  axiom: string;
  rules: Record<string, string>;
  angle?: number;
  drawLetters?: string; // which symbols should be treated as drawing moves (replaced with 'F')
};

type Point = { x: number; y: number };

function lsystem(axiom: string, rules: Record<string, string>, iterations: number) {
  let s = axiom;
  for (let i = 0; i < iterations; i++) {
    let next = '';
    for (const ch of s) next += rules[ch] ?? ch;
    s = next;
  }
  return s;
}

function turtle(commands: string, angleDeg: number, step: number) {
  const pts: Point[] = [];
  let x = 0,
    y = 0;
  let angle = 0; // radians
  pts.push({ x, y });
  const a = (angleDeg * Math.PI) / 180;
  const stack: Array<{ x: number; y: number; angle: number }> = [];
  for (const ch of commands) {
    if (ch === 'F' || ch === 'f') {
      x += Math.cos(angle) * step;
      y += Math.sin(angle) * step;
      if (ch === 'F') pts.push({ x, y });
    } else if (ch === '+') {
      angle -= a;
    } else if (ch === '-') {
      angle += a;
    } else if (ch === '[') {
      stack.push({ x, y, angle });
    } else if (ch === ']') {
      const s = stack.pop();
      if (s) {
        x = s.x;
        y = s.y;
        angle = s.angle;
        pts.push({ x, y });
      }
    }
  }
  return pts;
}

// parse lines like "X=someRule" into a rules object
export function parseRulesText(rulesText: string) {
  const rules: Record<string, string> = {};
  const lines = rulesText.split(/\r?\n/);
  for (let ln of lines) {
    ln = ln.trim();
    if (!ln) continue;
    // allow a form like "A = A+B" or "F=F+F" or "X += Y" ??? stick to '='
    const m = ln.match(/^([^=\s])\s*=\s*(.+)$/);
    if (m) rules[m[1]] = m[2];
  }
  return rules;
}

// generate points from arbitrary axiom and rules
export function generateCustomFractalPoints(
  axiom: string,
  rulesText: string,
  angle = 90,
  iterations = 1,
  step = 8,
  width = 800,
  height = 600,
  drawLetters = 'F'
) {
  const rules = parseRulesText(rulesText);
  const s = lsystem(axiom, rules, iterations);
  // replace drawLetters with 'F' so turtle moves on those characters
  const escaped = drawLetters.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const commands = s.replace(new RegExp('[' + escaped + ']', 'g'), 'F');
  const pts = turtle(commands, angle, step);
  return normalize(pts, width, height, 12);
}

// canonical fractal definitions
export const fractals = {
  koch: {
    id: 'koch',
    label: 'Koch Curve / Snowflake',
    axiom: 'F',
    rules: { F: 'F+F--F+F' },
    angle: 60,
    drawLetters: 'F'
  },
  dragon: {
    id: 'dragon',
    label: 'Dragon Curve',
    axiom: 'FX',
    rules: { X: 'X+YF+', Y: '-FX-Y' },
    angle: 90,
    drawLetters: 'F'
  },
  sierpinski: {
    id: 'sierpinski',
    label: 'Sierpinski (L-system)',
    axiom: 'A',
    rules: { A: 'B-A-B', B: 'A+B+A' },
    angle: 60,
    drawLetters: 'AB'
  },
  hilbert: {
    id: 'hilbert',
    label: 'Hilbert Curve',
    axiom: 'A',
    rules: { A: '-BF+AFA+FB-', B: '+AF-BFB-FA+' },
    angle: 90,
    drawLetters: 'AB'
  },
  plant: {
    id: 'plant',
    label: 'Plant',
    axiom: 'F',
    rules: { F: 'F[+F]F[-F]F' },
    angle: 25,
    drawLetters: 'F'
  },
  gosper: {
    id: 'gosper',
    label: 'Gosper Curve',
    axiom: 'A',
    rules: { A: 'A-B--B+A++AA+B-', B: '+A-BB--B-A++A+B' },
    angle: 60,
    drawLetters: 'AB'
  },
  peano: {
    id: 'peano',
    label: 'Peano Curve',
    axiom: 'A',
    rules: {
      A: 'AFBFA+F+BFAFB-F-AFBFA',
      B: 'AFBFA-F-BFAFB+F+AFBFA'
    },
    angle: 90,
    drawLetters: 'AB'
  },
  levy: {
    id: 'levy',
    label: 'Levy Curve',
    axiom: 'F',
    rules: { F: '+F--F+' },
    angle: 45,
    drawLetters: 'F'
  },
  quadratic_koch: {
    id: 'quadratic_koch',
    label: 'Quadratic Koch',
    axiom: 'F',
    rules: { F: 'F+F-F-F+F' },
    angle: 90,
    drawLetters: 'F'
  },
  pythagoras_tree: {
    id: 'pythagoras_tree',
    label: 'Pythagoras Tree',
    axiom: '0',
    rules: { '1': '11', '0': '1[+0]-0' },
    angle: 45,
    drawLetters: '01'
  },
  bush: {
    id: 'bush',
    label: 'Bush',
    axiom: 'F',
    rules: { F: 'FF-[-F+F+F]+[+F-F-F]' },
    angle: 22.5,
    drawLetters: 'F'
  },
  crystal: {
    id: 'crystal',
    label: 'Crystal',
    axiom: 'F+F+F+F',
    rules: { F: 'FF+F++F+F' },
    angle: 90,
    drawLetters: 'F'
  },
  board: {
    id: 'board',
    label: 'Board',
    axiom: 'F+F+F+F',
    rules: { F: 'FF+F+F+F+FF' },
    angle: 90,
    drawLetters: 'F'
  },
  quadratic_snowflake: {
    id: 'quadratic_snowflake',
    label: 'Quadratic Snowflake',
    axiom: 'F',
    rules: { F: 'F-F+F+F-F' },
    angle: 90,
    drawLetters: 'F'
  },
  custom: {
    id: 'custom',
    label: 'Custom L-system',
    axiom: 'F',
    rules: { F: 'F+F--F+F' },
    angle: 90,
    drawLetters: 'F'
  }
} as const;

export type FractalType = keyof typeof fractals;

function toCommandsFromDef(def: FractalDef, iterations: number) {
  const s = lsystem(def.axiom, def.rules, iterations);
  if (def.drawLetters) {
    const escaped = def.drawLetters.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    return s.replace(new RegExp('[' + escaped + ']', 'g'), 'F');
  }
  return s;
}

function normalize(points: Point[], width: number, height: number, padding = 8) {
  if (points.length === 0) return points;
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  const w = maxX - minX || 1;
  const h = maxY - minY || 1;
  const availW = Math.max(1, width - padding * 2);
  const availH = Math.max(1, height - padding * 2);
  const scale = Math.min(availW / w, availH / h);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const tx = width / 2;
  const ty = height / 2;
  return points.map((p) => ({
    x: tx + (p.x - cx) * scale,
    y: ty + (p.y - cy) * scale
  }));
}

export function generateFractalPoints(
  typeOrDef: FractalType | FractalDef,
  iterations: number,
  step = 8,
  width = 800,
  height = 600
) {
  let def: FractalDef;
  if (typeof typeOrDef === 'string') {
    def = fractals[typeOrDef];
  } else {
    def = typeOrDef;
  }
  if (!def) return [];
  const commands = toCommandsFromDef(def, iterations);
  const angle = def.angle ?? 90;
  const pts = turtle(commands, angle, step);
  return normalize(pts, width, height, 12);
}

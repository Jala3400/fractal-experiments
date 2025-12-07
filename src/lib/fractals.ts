export type FractalType = 'koch' | 'dragon' | 'sierpinski';

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
  for (const ch of commands) {
    if (ch === 'F' || ch === 'f') {
      x += Math.cos(angle) * step;
      y += Math.sin(angle) * step;
      if (ch === 'F') pts.push({ x, y });
    } else if (ch === '+') {
      angle -= a;
    } else if (ch === '-') {
      angle += a;
    }
  }
  return pts;
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
  type: FractalType,
  iterations: number,
  step = 8,
  width = 800,
  height = 600
) {
  let pts: Point[] = [];
  if (type === 'koch') {
    const axiom = 'F';
    const rules = { F: 'F+F--F+F' };
    const s = lsystem(axiom, rules, iterations);
    pts = turtle(s, 60, step);
  } else if (type === 'dragon') {
    const axiom = 'FX';
    const rules: Record<string, string> = { X: 'X+YF+', Y: '-FX-Y' };
    const s = lsystem(axiom, rules, iterations);
    pts = turtle(s.replace(/X|Y/g, ''), 90, step);
  } else if (type === 'sierpinski') {
    const axiom = 'A';
    const rules: Record<string, string> = { A: 'B-A-B', B: 'A+B+A' };
    const s = lsystem(axiom, rules, iterations);
    pts = turtle(s, 60, step);
  }
  return normalize(pts, width, height, 12);
}

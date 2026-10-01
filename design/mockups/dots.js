// Dot-matrix helpers shared by the mockups.

// Deterministic "recording" of a typing test: sharp transients that decay,
// spaced like real keystrokes, with a few spacebar thuds.
export function fakeTyping(seed, length = 1, columns = 96) {
  let s = seed * 9301 + 49297;
  const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const values = new Array(columns).fill(0);
  let t = 0;
  while (t < columns) {
    const strength = rand() < 0.12 ? 1 : 0.45 + rand() * 0.4;
    for (let i = 0; i < 4 && t + i < columns; i++) values[t + i] = Math.max(values[t + i], strength * Math.exp(-i * 0.9));
    t += 2 + Math.floor(rand() * 3);
  }
  return values.map((v) => Math.min(1, v * length + rand() * 0.06));
}

// Draw a waveform as an LED matrix: each column is a stack of dots mirrored around the centre line.
export function drawWave(svg, values, { rows = 13, gap = 10, r = 2.6, lit = '#ff00aa', dim = '#2b2b2e', progress = 0 } = {}) {
  const ns = 'http://www.w3.org/2000/svg';
  svg.innerHTML = '';
  const width = values.length * gap;
  const height = rows * gap;
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  const mid = (rows - 1) / 2;
  values.forEach((v, col) => {
    const reach = Math.round(v * mid);
    for (let row = 0; row < rows; row++) {
      const on = Math.abs(row - mid) <= reach;
      const c = document.createElementNS(ns, 'circle');
      c.setAttribute('cx', col * gap + gap / 2);
      c.setAttribute('cy', row * gap + gap / 2);
      c.setAttribute('r', r);
      const played = col / values.length < progress;
      c.setAttribute('fill', on ? (played ? lit : '#5b5b60') : dim);
      if (on && played) c.setAttribute('style', `filter: drop-shadow(0 0 3px ${lit})`);
      svg.appendChild(c);
    }
  });
}

// Write text into a row of dots using a 5x7 font (subset).
const GLYPHS = {
  a: ['01110','10001','10001','11111','10001','10001','10001'],
  b: ['11110','10001','10001','11110','10001','10001','11110'],
  c: ['01111','10000','10000','10000','10000','10000','01111'],
  d: ['11110','10001','10001','10001','10001','10001','11110'],
  e: ['11111','10000','10000','11110','10000','10000','11111'],
  f: ['11111','10000','10000','11110','10000','10000','10000'],
  g: ['01111','10000','10000','10111','10001','10001','01111'],
  h: ['10001','10001','10001','11111','10001','10001','10001'],
  i: ['01110','00100','00100','00100','00100','00100','01110'],
  k: ['10001','10010','10100','11000','10100','10010','10001'],
  l: ['10000','10000','10000','10000','10000','10000','11111'],
  m: ['10001','11011','10101','10101','10001','10001','10001'],
  n: ['10001','11001','10101','10011','10001','10001','10001'],
  o: ['01110','10001','10001','10001','10001','10001','01110'],
  p: ['11110','10001','10001','11110','10000','10000','10000'],
  r: ['11110','10001','10001','11110','10100','10010','10001'],
  s: ['01111','10000','10000','01110','00001','00001','11110'],
  t: ['11111','00100','00100','00100','00100','00100','00100'],
  u: ['10001','10001','10001','10001','10001','10001','01110'],
  w: ['10001','10001','10001','10101','10101','11011','10001'],
  y: ['10001','10001','01010','00100','00100','00100','00100'],
  ',': ['00000','00000','00000','00000','00110','00100','01000'],
  '.': ['00000','00000','00000','00000','00000','01100','01100'],
  "'": ['00100','00100','01000','00000','00000','00000','00000'],
  '?': ['01110','10001','00001','00110','00100','00000','00100'],
  ' ': ['00000','00000','00000','00000','00000','00000','00000'],
  '_': ['00000','00000','00000','00000','00000','00000','11111'],
};

export function drawText(svg, text, { cols = 64, gap = 8, r = 2.6, lit = '#ff00aa', dim = '#1f1f22', offset = 0 } = {}) {
  const ns = 'http://www.w3.org/2000/svg';
  svg.innerHTML = '';
  const rows = 7;
  svg.setAttribute('viewBox', `0 0 ${cols * gap} ${(rows + 2) * gap}`);
  const columns = [];
  for (const ch of text.toLowerCase()) {
    const g = GLYPHS[ch] || GLYPHS[' '];
    for (let x = 0; x < 5; x++) columns.push(g.map((row) => row[x] === '1'));
    columns.push(new Array(rows).fill(false));
  }
  for (let col = 0; col < cols; col++) {
    const data = columns[col + offset] || new Array(rows).fill(false);
    for (let row = 0; row < rows; row++) {
      const c = document.createElementNS(ns, 'circle');
      c.setAttribute('cx', col * gap + gap / 2);
      c.setAttribute('cy', (row + 1) * gap + gap / 2);
      c.setAttribute('r', r);
      c.setAttribute('fill', data[row] ? lit : dim);
      if (data[row]) c.setAttribute('style', `filter: drop-shadow(0 0 2.5px ${lit})`);
      svg.appendChild(c);
    }
  }
  return columns.length;
}

// Turns the original photos in photos/<build>/<name>.<ext> into web-sized
// copies at public/builds/<build>/<name>-<width>.webp. Runs before every
// build and skips anything already up to date.
//
// To add photos: drop them in photos/<build-slug>/ (cover.jpg, 1.jpg, ...)
// and reference them in src/data/builds.ts as "<build-slug>/<name>".
// A sound test goes in as photos/<build-slug>/sound.mp3 and is copied as-is.

import { copyFile, mkdir, readdir, stat } from 'node:fs/promises';
import { join, parse } from 'node:path';
import sharp from 'sharp';

export const WIDTHS = [640, 1600];
const SOURCE = 'photos';
const OUTPUT = 'public/builds';
const IMAGE = /\.(jpe?g|png|webp|heic|avif|tiff?)$/i;

async function newer(source, target) {
  try {
    return (await stat(source)).mtimeMs > (await stat(target)).mtimeMs;
  } catch {
    return true;
  }
}

let written = 0;
for (const build of await readdir(SOURCE)) {
  const dir = join(SOURCE, build);
  if (!(await stat(dir)).isDirectory()) continue;
  await mkdir(join(OUTPUT, build), { recursive: true });

  for (const file of await readdir(dir)) {
    if (file === 'sound.mp3') {
      const target = join(OUTPUT, build, 'sound.mp3');
      if (await newer(join(dir, file), target)) {
        await copyFile(join(dir, file), target);
        written++;
      }
      continue;
    }
    if (!IMAGE.test(file)) continue;
    const source = join(dir, file);
    const { name } = parse(file);
    for (const width of WIDTHS) {
      const target = join(OUTPUT, build, `${name}-${width}.webp`);
      if (!(await newer(source, target))) continue;
      await sharp(source)
        .rotate() // respect the camera's orientation flag
        .resize({ width, height: width, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: width > 1000 ? 80 : 74 })
        .toFile(target);
      written++;
    }
  }
}
console.log(`photos: ${written} file${written === 1 ? '' : 's'} written`);

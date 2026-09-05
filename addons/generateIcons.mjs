import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

// Raster fallbacks use the same vector master as the browser SVG icon.
const master = new URL('../public/favicon.svg', import.meta.url);
const png = await sharp(master.pathname).resize(32, 32).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header[6] = 32;
header[7] = 32;
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
await writeFile(new URL('../public/favicon.ico', import.meta.url), Buffer.concat([header, png]));
await sharp(master.pathname)
  .resize(180, 180)
  .png()
  .toFile(new URL('../public/apple-touch-icon.png', import.meta.url).pathname);

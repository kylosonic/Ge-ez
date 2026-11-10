import { readdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const productDirectory = join(process.cwd(), 'dist', 'products');
const publicProductNames = new Set(['library-index-sample.pdf']);

for (const name of readdirSync(productDirectory)) {
  if (name.endsWith('.pdf') && !publicProductNames.has(name)) {
    unlinkSync(join(productDirectory, name));
  }
}

import { glob } from 'glob';
import path from 'node:path';
import { ImageExt } from './types';

export const locale = Intl.DateTimeFormat().resolvedOptions().locale;

export async function getFiles(dir: string, exts: ImageExt[], recursive?: boolean) {
  const extsString = exts.map((ext) => ext.slice(1)).join(',');
  const currentDir = exts.length === 1 ? `/*.${extsString}` : `/*.{${extsString}}`;
  const recursiveDir = exts.length === 1 ? `/**/**/*.${extsString}` : `/**/**/*.{${extsString}}`;
  return await glob(path.join(dir, recursive ? recursiveDir : currentDir));
}

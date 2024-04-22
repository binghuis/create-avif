import path from 'node:path';
import { ImageExt, ImageExtensionsEnum } from './types';

export const locale = Intl.DateTimeFormat().resolvedOptions().locale;

export function isImgFile(filePath: string, exts?: ImageExt[]) {
  const imageExtensions = exts ? exts : Object.values(ImageExtensionsEnum);
  const ext = path.extname(filePath).toLowerCase();
  return imageExtensions.includes(ext as ImageExt);
}

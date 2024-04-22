import path from 'node:path';
import { ImageExtensionsEnum } from './types';

export const locale = Intl.DateTimeFormat().resolvedOptions().locale;

export function isImgFile(filePath: string, exts?: ImageExtensionsEnum[]) {
  const imageExtensions = exts ? exts : Object.values(ImageExtensionsEnum);
  console.log(imageExtensions);

  const ext = path.extname(filePath).toLowerCase();
  return imageExtensions.includes(ext as ImageExtensionsEnum);
}

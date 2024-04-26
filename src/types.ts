export enum ImageExtensionsEnum {
  Jpg = '.jpg',
  Jpeg = '.jpeg',
  Png = '.png',
  Svg = '.svg',
}

export type ImageFormat = keyof typeof ImageExtensionsEnum;

export type ImageExt = `.${Lowercase<keyof typeof ImageExtensionsEnum>}`;

export type ImageSelectOpt = { label: ImageFormat; value: ImageExt };

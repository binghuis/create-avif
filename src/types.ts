export enum ImageExtensionsEnum {
  Jpg = '.jpg',
  Jpeg = '.jpeg',
  Png = '.png',
  Gif = '.gif',
}

export type ImageFormat = Lowercase<keyof typeof ImageExtensionsEnum>;

export type ImageExt = `.${Lowercase<keyof typeof ImageExtensionsEnum>}`;

export type ImageSelectOpt = { label: ImageFormat; value: ImageExt };

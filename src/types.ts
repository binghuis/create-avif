export enum ImageExtensionsEnum {
  Jpg = '.jpg',
  Jpeg = '.jpeg',
  Png = '.png',
  Gif = '.gif',
}

export type ImageType = Lowercase<keyof typeof ImageExtensionsEnum>;

export type ImageExt = `.${Lowercase<keyof typeof ImageExtensionsEnum>}`;

export type ImageSelectOpt = { label: ImageType; value: ImageExt };

import * as p from '@clack/prompts';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import locales from './locales';
import { ImageExt, ImageExtensionsEnum, ImageSelectOpt } from './types';
import { isSelectedImage } from './utils';

const cancel = (message?: string) => {
  p.cancel(message ?? '✖ 已取消');
  process.exit(0);
};

async function main() {
  const defaultInput = './assets';
  const input = await p.text({
    message: locales['input'],
    placeholder: defaultInput,
    initialValue: defaultInput,
    validate(value) {
      if (!fs.existsSync(value)) {
        return locales['inputRequire'];
      }
    },
  });

  const cwd = process.cwd();
  const absInput = path.resolve(cwd, input.toString());

  const recursive = await p.confirm({
    message: locales['recursive'],
    initialValue: true,
  });

  const imgFormatSelectedOpts = Object.entries(ImageExtensionsEnum).map(([label, value]) => ({
    label,
    value,
  })) as ImageSelectOpt[];

  const imgFormatSelected = await p.multiselect<ImageSelectOpt[], ImageExt>({
    message: locales['imgFormat'],
    options: imgFormatSelectedOpts,
    initialValues: [ImageExtensionsEnum.Jpg, ImageExtensionsEnum.Png, ImageExtensionsEnum.Jpeg],
    required: true,
  });

  const quality = await p.text({
    message: locales['quality'],
    placeholder: '50',
    initialValue: '50',
    validate(value) {
      const num = parseInt(value);
      if (isNaN(num) || num < 1 || num > 100) {
        return locales['qualityRange'];
      }
    },
  });

  async function convert(inputDir: string) {
    const hiers = fs.readdirSync(inputDir, { recursive: Boolean(recursive) });
    for (const hier of hiers) {
      const absHier = path.join(inputDir, hier.toString());
      if (fs.lstatSync(absHier).isDirectory()) {
        convert(absHier);
      } else if (isSelectedImage(absHier, imgFormatSelected as ImageExt[])) {
        const pipeline = sharp(absHier).avif({
          quality: parseInt(quality.toString()),
          lossless: false,
        });
        let outputFilename = path.basename(absHier);
        outputFilename = outputFilename.replace(path.extname(absHier), '.avif');

        const outputPath = path.join(path.dirname(absHier), outputFilename);
        await pipeline.toFile(outputPath);
      }
    }
  }
  const spinner = p.spinner();
  spinner.start(locales['convertStart']);
  await convert(absInput);
  spinner.stop(locales['convertEnd']);
}

main();

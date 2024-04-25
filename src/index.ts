import * as p from '@clack/prompts';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import locales from './locales';
import { ImageExt, ImageExtensionsEnum, ImageSelectOpt } from './types';
import { isSelectedImage } from './utils';

const imgFormatSelectedOpts = Object.entries(ImageExtensionsEnum).map(([label, value]) => ({
  label,
  value,
})) as ImageSelectOpt[];

const cancel = (message?: string) => {
  p.cancel(message ?? locales['cancel']);
  process.exit(0);
};

async function main() {
  const defaultInput = './';
  const options = await p.group(
    {
      input: () =>
        p.text({
          message: locales['input'],
          placeholder: defaultInput,
          initialValue: defaultInput,
          validate(value) {
            if (!fs.existsSync(value)) {
              return locales['inputRequire'];
            }
          },
        }),
      imgFormatSelected: () => {
        return p.multiselect<ImageSelectOpt[], ImageExt>({
          message: locales['imgFormat'],
          options: imgFormatSelectedOpts,
          initialValues: [
            ImageExtensionsEnum.Jpg,
            ImageExtensionsEnum.Png,
            ImageExtensionsEnum.Jpeg,
          ],
          required: true,
        });
      },
      quality: () =>
        p.select({
          message: locales['quality'],
          options: [
            { value: 50, label: '50', hint: '⬇️ 90%' },
            { value: 75, label: '75', hint: '⬇️ 50%' },
          ],
          initialValue: 50,
        }),
      lossy: () =>
        p.confirm({
          message: locales['lossy'],
          initialValue: true,
        }),
      effort: () =>
        p.select({
          message: locales['effort'],
          options: [
            { value: 0, label: '0' },
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
            { value: 4, label: '4' },
            { value: 5, label: '5' },
            { value: 6, label: '6' },
            { value: 7, label: '7' },
            { value: 8, label: '8' },
            { value: 9, label: '9' },
          ],
          initialValue: 4,
        }),
    },
    {
      onCancel: () => {
        cancel();
      },
    },
  );
  const { input, imgFormatSelected, quality, lossy, effort } = options;

  const cwd = process.cwd();
  const absInput = path.resolve(cwd, input);

  async function convert(inputDir: string) {
    const hiers = fs.readdirSync(inputDir, { recursive: true });
    for (const hier of hiers) {
      const absHier = path.join(inputDir, hier.toString());
      if (fs.lstatSync(absHier).isDirectory()) {
        convert(absHier);
      } else if (isSelectedImage(absHier, imgFormatSelected)) {
        const pipeline = sharp(absHier).avif({
          quality,
          lossless: !lossy,
          effort,
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

main().catch((err) => {
  process.exit(1);
});

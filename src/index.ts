import * as p from '@clack/prompts';
import kleur from 'kleur';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import locales from './locales';
import { ImageExt, ImageExtensionsEnum, ImageSelectOpt } from './types';
import { getFiles } from './utils';

const imgFormatSelectedOpts = Object.entries(ImageExtensionsEnum).map(([label, value]) => ({
  label,
  value,
})) as ImageSelectOpt[];

const cancel = (message?: string) => {
  p.cancel(message ?? locales['cancel']);
  process.exit(0);
};

async function main() {
  const defaultInput = './assets';
  const options = await p.group(
    {
      input: () =>
        p.text({
          message: kleur.cyan(locales['input']),
          placeholder: defaultInput,
          initialValue: defaultInput,
          validate(value) {
            if (!fs.existsSync(value)) {
              return locales['inputRequire'];
            }
          },
        }),
      recursive: () =>
        p.confirm({
          message: kleur.cyan(locales['recursive']),
          initialValue: true,
        }),
      imgFormatSelected: () => {
        return p.multiselect<ImageSelectOpt[], ImageExt>({
          message: kleur.cyan(locales['imgFormat']),
          options: imgFormatSelectedOpts,
          initialValues: [
            ImageExtensionsEnum.Jpg,
            ImageExtensionsEnum.Png,
            ImageExtensionsEnum.Jpeg,
            ImageExtensionsEnum.Gif,
            ImageExtensionsEnum.Svg,
          ],
          required: true,
        });
      },
      quality: () =>
        p.select({
          message: kleur.cyan(locales['quality']),
          options: [
            { value: 50, label: '50', hint: '⬇️ 90%' },
            { value: 75, label: '75', hint: '⬇️ 50%' },
          ],
          initialValue: 50,
        }),
      lossy: () =>
        p.confirm({
          message: kleur.cyan(locales['lossy']),
          initialValue: true,
        }),
      effort: () =>
        p.select({
          message: kleur.cyan(locales['effort']),
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
  const { input, imgFormatSelected, quality, lossy, effort, recursive } = options;

  const cwd = process.cwd();
  const absInput = path.resolve(cwd, input);

  let successCount = 0;
  let errorCount = 0;

  async function convert(inputDir: string) {
    const hiers = await getFiles(inputDir, imgFormatSelected, recursive);
    return hiers.map((hier) => {
      return new Promise<string>((resolve, reject) => {
        const pipeline = sharp(hier).avif({
          quality,
          lossless: !lossy,
          effort,
        });
        let outputFilename = path.basename(hier);
        outputFilename = outputFilename.replace(path.extname(hier), '.avif');
        const outputPath = path.join(path.dirname(hier), outputFilename);
        pipeline.toFile(outputPath, (err, info) => {
          if (err) {
            p.log.info(`${kleur.red(hier)}${kleur.red().bold(' (' + err.message + ') ')}`);
            errorCount++;
            reject(err);
          } else {
            p.log.info(`${kleur.green(hier)}`);
            successCount++;
            resolve('');
          }
        });
      });
    });
  }

  p.log.step(kleur.magenta(locales['convertStart']));
  const promises = await convert(absInput);

  await Promise.allSettled(promises);

  p.log.success(kleur.magenta(locales['convertEnd']));

  console.log(successCount, errorCount);
}

main().catch((err) => {
  console.log(kleur.bgRed(err));
  process.exit(1);
});

import * as p from '@clack/prompts';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import locales from './locales';
import { ImageExt, ImageExtensionsEnum, ImageSelectOpt } from './types';
import { isImgFile } from './utils';

async function main() {
  const defaultInput = './assets';
  const input = await p.text({
    message: locales['input'],
    placeholder: defaultInput,
    initialValue: defaultInput,
    validate(value) {
      if (!fs.existsSync(value.toString())) {
        return locales['inputRequire'];
      }
    },
  });

  const cwd = process.cwd();
  const inputDir = path.resolve(cwd, input.toString());

  const recursive = await p.confirm({
    message: locales['recursive'],
    initialValue: true,
  });

  const imgFormatSelected = await p.multiselect<ImageSelectOpt[], ImageExt>({
    message: locales['imgFormat'],
    options: Object.values(ImageExtensionsEnum).map((val) => ({
      label: val.slice(1),
      value: val,
    })) as ImageSelectOpt[],
  });

  const quality = await p.text({
    message: locales['quality'],
    placeholder: '50',
    initialValue: '50',
    validate(value) {
      const num = Number(value);
      if (isNaN(num) || num < 1 || num > 100) {
        return locales['qualityRange'];
      }
    },
  });

  const output = await p.text({
    message: locales['output'],
    placeholder: './output',
    initialValue: './output',
  });

  const outputDir = path.resolve(cwd, output.toString());

  async function convert(inputDir: string) {
    const files = fs.readdirSync(inputDir, { recursive: Boolean(recursive) });
    for (const hier of files) {
      const input = path.resolve(inputDir, hier.toString());
      if (fs.lstatSync(input).isDirectory()) {
        convert(input);
      } else {
        if (isImgFile(input, imgFormatSelected as ImageExt[])) {
          const pipeline = sharp(input).avif({
            quality: parseInt(quality.toString()),
            lossless: false,
          });
          let outputFilename = path.basename(input);
          outputFilename = outputFilename.replace(path.extname(input), '.avif');

          const outputPath = path.join(outputDir ? outputDir : path.dirname(input), outputFilename);
          await pipeline.toFile(outputPath);
        }
      }
    }
  }
  const spinner = p.spinner();
  spinner.start(locales['convertStart']);
  await convert(inputDir);
  spinner.stop(locales['convertEnd']);
}

main();

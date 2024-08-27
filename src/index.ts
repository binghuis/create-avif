#! /usr/bin/env node

import * as p from '@clack/prompts';
import { program } from 'commander';
import kleur from 'kleur';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import pkg from '../package.json';
import locales from './locales';
import { ImageExt, ImageExtensionsEnum, ImageSelectOpt } from './types';
import { getFiles } from './utils';

program.name(pkg.name).description(pkg.description).version(pkg.version);

program.parse();

const imgFormatSelectedOpts = Object.entries(ImageExtensionsEnum).map(([label, value]) => ({
  label,
  value,
})) as ImageSelectOpt[];

const cancel = (message?: string) => {
  p.cancel(message ?? locales['cancel']);
  process.exit(0);
};

async function main() {
  const defaultInput = '.';
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
          ],
          required: true,
        });
      },
      quality: () =>
        p.select({
          message: kleur.cyan(locales['quality']),
          options: [
            { value: 50, label: '50', hint: locales['less90'] },
            { value: 75, label: '75', hint: locales['less50'] },
          ],
          initialValue: 50,
        }),
      ignore: () =>
        p.text({
          message: kleur.cyan(locales['ignore']),
          placeholder: '10',
          initialValue: '10',
          validate(value) {
            try {
              Number(value);
            } catch (error) {
              return locales['validNumber'];
            }
          },
        }),
      lossy: () =>
        p.confirm({
          message: kleur.cyan(locales['lossy']),
          initialValue: true,
        }),
      effort: () =>
        p.text({
          message: kleur.cyan(locales['effort']),
          placeholder: '4',
          initialValue: '4',
          validate(value) {
            try {
              const num = Number(value);
              if (!Number.isInteger(num) || num > 9 || num < 0) {
                return locales['effortRange'];
              }
            } catch (error) {
              return locales['effortRange'];
            }
          },
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
        if (fs.statSync(hier).size < Number(options.ignore) * 1024) {
          return resolve('');
        }
        const pipeline = sharp(hier, { animated: true }).avif({
          quality,
          lossless: !lossy,
          effort: Number(effort),
        });
        let outputFilename = path.basename(hier);
        outputFilename = outputFilename.replace(path.extname(hier), '.avif');
        const outputPath = path.join(path.dirname(hier), outputFilename);
        pipeline.toFile(outputPath, (err, info) => {
          if (err) {
            p.log.error(`${kleur.red(hier)}${kleur.red().bold(' (' + err.message + ') ')}`);
            errorCount++;
            reject(err);
          } else {
            p.log.success(`${kleur.green(hier)}`);
            successCount++;
            resolve('');
          }
        });
      });
    });
  }

  p.log.step(kleur.cyan(locales['convertStart']));
  const promises = await convert(absInput);

  await Promise.allSettled(promises);

  p.log.info(
    `${kleur.cyan(locales['convertEnd'])}\n${kleur.green(locales['success'] + successCount)}\n${kleur.red(locales['failure'] + errorCount)}`,
  );
}

main().catch((err) => {
  p.log.error(kleur.red(err.message));
  process.exit(1);
});

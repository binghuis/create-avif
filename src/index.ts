import * as p from '@clack/prompts';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { ImageExt, ImageExtensionsEnum, ImageSelectOpt } from './types';
import { isImgFile } from './utils';
// import { locale } from './utils';

async function main() {
  const defaultInput = './assets';
  const input = await p.text({
    message: '图片所在目录',
    placeholder: defaultInput,
    initialValue: defaultInput,
    validate(value) {
      if (!fs.existsSync(value.toString())) {
        return '该目录不存在，请选择一个有效目录';
      }
    },
  });

  const cwd = process.cwd();
  const inputDir = path.resolve(cwd, input.toString());

  const recursive = await p.confirm({
    message: '是否递归处理子目录',
    initialValue: true,
  });

  const imgTypeSelected = await p.multiselect<ImageSelectOpt[], ImageExt>({
    message: '选择你想转换的图片格式',
    options: Object.values(ImageExtensionsEnum).map((val) => ({
      label: val.slice(1),
      value: val,
    })) as ImageSelectOpt[],
  });

  const quality = await p.text({
    message: '生成图片质量',
    placeholder: '50',
    initialValue: '50',
    validate(value) {
      const num = Number(value);
      if (isNaN(num) || num < 1 || num > 100) {
        return '请输入 1-100 之间的数字';
      }
    },
  });

  const output = await p.text({
    message: 'avif 图片生成目录',
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
        if (isImgFile(input, imgTypeSelected as ImageExt[])) {
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
  spinner.start('正在生成 avif 图片');
  await convert(inputDir);
  spinner.stop('avif 图片生成完成');
}

main();

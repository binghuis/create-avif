import * as p from '@clack/prompts';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { ImageExtensionsEnum } from './types';
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

  const imgTypeSelected = await p.multiselect({
    message: '选择你想转换的图片格式',
    options: Object.keys(ImageExtensionsEnum).map((key) => ({
      label: key.toLowerCase(),
      value: key.toLowerCase(),
    })),
  });

  const quality = await p.text({
    message: '生成图片质量',
    placeholder: '75',
    initialValue: '75',
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

  function convert(inputDir: string, outputDir: string) {
    fs.readdirSync(inputDir, { recursive: Boolean(recursive) }).forEach((hier) => {
      if ((isImgFile(hier.toString()), imgTypeSelected)) {
        const pipeline = sharp(hier).avif({
          quality: parseInt(quality.toString()),
          lossless: false,
        });
        pipeline.toFile(outputDir);
      }
      if (fs.lstatSync(hier).isDirectory()) {
        convert(hier.toString(), path.resolve(outputDir, hier.toString()));
      }
    });
  }

  convert(inputDir, outputDir);
}

main();

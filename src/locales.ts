import { locale } from './utils';

interface Locales {
  input: string;
  inputRequire: string;
  recursive: string;
  imgFormat: string;
  quality: string;
  qualityRange: string;
  convertStart: string;
  convertEnd: string;
  lossless: string;
}

const en: Locales = {
  input: 'Directory of the image',
  inputRequire: 'The directory does not exist. Please provide a valid path',
  recursive: 'Process subdirectories recursively?',
  imgFormat: 'Select the image format you want to convert to',
  quality: 'Image quality',
  qualityRange: 'Please enter a number between 1 and 100',
  convertStart: 'Start conversion',
  convertEnd: 'Conversion completed!',
  lossless: 'Use lossless compression',
};

const zhCn: Locales = {
  input: '图片所在目录',
  inputRequire: '该目录不存在，请提供一个有效路径',
  recursive: '是否递归处理子目录',
  imgFormat: '选择你想转换的图片格式',
  quality: '生成图片质量',
  qualityRange: '请输入 1-100 之间的数字',
  convertStart: '开始转换',
  convertEnd: '转换完成！',
  lossless: '使用无损压缩',
};

let locales = en;
if (locale === 'zh-CN') {
  locales = zhCn;
}

export default locales;

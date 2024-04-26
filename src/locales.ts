import { locale } from './utils';

interface Locales {
  input: string;
  inputRequire: string;
  imgFormat: string;
  quality: string;
  convertStart: string;
  convertEnd: string;
  lossy: string;
  effort: string;
  cancel: string;
  recursive: string;
}

const enUs: Locales = {
  input: 'Directory of the image',
  inputRequire: 'The directory does not exist. Please provide a valid path',
  imgFormat: 'Select the image format you want to convert to',
  quality: 'Image quality',
  lossy: 'Use lossy compression',
  effort: 'Compression ratio (higher compression ratio results in slower processing speed)',
  convertStart: 'Start conversion',
  convertEnd: 'Conversion completed!',
  cancel: 'Cancelled',
  recursive: 'Process subdirectories recursively',
};

const zhCn: Locales = {
  input: '图片所在目录',
  inputRequire: '该目录不存在，请提供一个有效路径',
  imgFormat: '选择你想转换的图片格式',
  quality: '生成图片质量',
  lossy: '采用有损压缩',
  effort: '压缩率（压缩率越高处理速度越慢）',
  convertStart: '开始转换',
  convertEnd: '转换完成！',
  cancel: '已取消',
  recursive: '是否递归处理子目录',
};

let locales = enUs;

if (locale === 'zh-CN') {
  locales = zhCn;
}

export default locales;

interface Locales {
  input: string;
  inputRequire: string;
  imgFormat: string;
  quality: string;
  convertStart: string;
  convertEnd: string;
  lossy: string;
  effort: string;
  effortRange: string;
  cancel: string;
  recursive: string;
  success: string;
  failure: string;
}

const enUs: Locales = {
  input: 'Directory of the image',
  inputRequire: 'The directory does not exist, please provide a valid path',
  imgFormat: 'Select the image format you want to convert to',
  quality: 'Image quality',
  lossy: 'Use lossy compression',
  effort: 'Compression effort (integer 0 - 9, larger values result in slower processing)',
  convertStart: 'Start conversion 🏂',
  convertEnd: 'Conversion completed 🎉',
  cancel: 'Cancelled',
  recursive: 'Process subdirectories recursively',
  success: 'Success',
  failure: 'Failure',
  effortRange: 'Please enter an integer between 0 and 9',
};

const zhCn: Locales = {
  input: '图片所在目录',
  inputRequire: '该目录不存在，请提供一个有效路径',
  imgFormat: '选择你想转换的图片格式',
  quality: '生成图片质量',
  lossy: '采用有损压缩',
  effort: '压缩率（整数 0 - 9，越大处理速度越慢）',
  convertStart: '开始转换 🏂',
  convertEnd: '转换完成 🎉',
  cancel: '已取消',
  recursive: '是否递归处理子目录',
  success: '成功',
  failure: '失败',
  effortRange: '请输入 0 - 9 之间的整数',
};

let locales = enUs;

// if (locale === 'zh-CN') {
//   locales = zhCn;
// }

export default locales;

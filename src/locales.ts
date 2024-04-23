import { locale } from './utils';

interface Locales {
  'img-where': string;
}

const en: Locales = {
  'img-where': 'Image directory',
};

const zhCn: Locales = {
  'img-where': '图片所在目录',
};

let locales = en;
if (locale === 'zh-CN') {
  locales = zhCn;
}

export default locales;

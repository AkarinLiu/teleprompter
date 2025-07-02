import { marked } from 'marked';

export const fontList = [
  'Arial',
  'Times New Roman',
  'Microsoft YaHei',
  'SimHei',
  'FangSong',
  'Courier New',
  'Georgia',
  'Verdana',
  'Tahoma',
  'Comic Sans MS',
];

export function parseContent(text: string, isMarkdown: boolean) {
  if (isMarkdown) {
    return marked.parse(text);
  }
  return text.replace(/\n/g, '<br>');
}

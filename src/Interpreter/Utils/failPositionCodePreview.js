import { repeat } from './repeat';

export function failPositionCodePreview(row, col, code) {
  const codeLines = code.split('\n');
  const previousLineNumber = `${row}: `;
  const lineNumber = `${row + 1}: `;
  const pointerLine = repeat(' ', lineNumber.length + col) + '^';

  return [
    '\n...\n' + (row > 0 ? previousLineNumber + codeLines[row - 1] : ''),
    lineNumber + codeLines[row],
    pointerLine,
    '...\n'
  ].join('\n');
}

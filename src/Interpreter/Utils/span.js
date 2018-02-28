import { repeat } from './repeat';

export function span(str, len) {
  return repeat(' ', len - str.length) + str;
}

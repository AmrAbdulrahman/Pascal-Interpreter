import { Break } from '../ASTNodes/*';
import { BREAK } from '../../Common/constants';

export function eatBreak() {
  this.eat(BREAK);
  return new Break();
}

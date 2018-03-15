import { Break } from '../ASTNodes/*';
import { BREAK } from '../../Common/constants';

export function eatBreak() {
  const token = this.currentToken;
  this.eat(BREAK);
  return new Break(token);
}

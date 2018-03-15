import { Continue } from '../ASTNodes/*';
import { CONTINUE } from '../../Common/constants';

export function eatContinue() {
  const token = this.currentToken;
  this.eat(CONTINUE);
  return new Continue(token);
}

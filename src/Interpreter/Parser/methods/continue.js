import { Continue } from '../ASTNodes/*';
import { CONTINUE } from '../../Common/constants';

export function eatContinue() {
  this.eat(CONTINUE);
  return new Continue();
}

import { REPEAT, TIMES, INTEGER_CONST } from '../../constants';
import { Repeat, Num } from '../../ASTNodes/*';

// repeat_block: REPEAT ID|INTEGER_CONST TIMES statement_or_block
export function eatRepeatBlock() {
  this.eat(REPEAT);

  let countNode;

  if (this.currentToken.is(INTEGER_CONST)) {
    countNode = new Num(this.currentToken);
    this.eat(INTEGER_CONST);
  } else {
    countNode = this.eatVariable();
  }

  this.eat(TIMES);
  const blockNode = this.eatStatementOrScopedBlock();

  return new Repeat(countNode, blockNode);
}

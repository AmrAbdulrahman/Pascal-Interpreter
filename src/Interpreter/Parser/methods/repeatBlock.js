import { REPEAT, TIMES, INTEGER_CONST } from '../../Common/constants';
import { Repeat, Num } from '../ASTNodes/*';

// repeat_block: REPEAT INTEGER_CONST|EXPR_CHAIN TIMES statement_or_block
export function eatRepeatBlock() {
  this.eat(REPEAT);

  let countNode;

  if (this.currentToken.is(INTEGER_CONST)) {
    countNode = new Num(this.currentToken);
    this.eat(INTEGER_CONST);
  } else {
    countNode = this.eatExprChain();
  }

  this.eat(TIMES);
  const blockNode = this.eatStatementOrScopedBlock();

  return new Repeat(countNode, blockNode);
}

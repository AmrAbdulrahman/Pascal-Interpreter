import { OPEN_CURLY_BRACE, CLOSE_CURLY_BRACE } from '../../Common/constants';
import { Block } from '../ASTNodes/Block';

// this is just a block, it does't open a new scope
// it's useful as `function`, `while`, or `for` body
// block : OPEN_CURLY_BRACE block CLOSE_CURLY_BRACE
export function eatBlock() {
  this.eat(OPEN_CURLY_BRACE);
  const blockNode = new Block(this.eatStatementList());
  this.eat(CLOSE_CURLY_BRACE);

  return blockNode;
}

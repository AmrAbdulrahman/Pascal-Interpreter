import { OPEN_CURLY_BRACE, CLOSE_CURLY_BRACE } from '../../Common/constants';
import { ScopedBlock } from '../ASTNodes/ScopedBlock';

// scoped_block : OPEN_CURLY_BRACE block CLOSE_CURLY_BRACE
export function eatScopedBlock() {
  this.eat(OPEN_CURLY_BRACE);
  const scopedBlockNode = new ScopedBlock(this.eatStatementList());
  this.eat(CLOSE_CURLY_BRACE);

  return scopedBlockNode;
}

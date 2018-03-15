import { OPEN_CURLY_BRACE, CLOSE_CURLY_BRACE } from '../../Common/constants';
import { ScopedBlock } from '../ASTNodes/ScopedBlock';

// scoped_block : OPEN_CURLY_BRACE block CLOSE_CURLY_BRACE
export function eatScopedBlock() {
  const openCurlyBraceToken = this.currentToken;
  this.eat(OPEN_CURLY_BRACE);

  const statementList = this.eatStatementList();

  const closeCurlyBraceToken = this.currentToken;
  this.eat(CLOSE_CURLY_BRACE);

  return new ScopedBlock(statementList, openCurlyBraceToken, closeCurlyBraceToken);
}

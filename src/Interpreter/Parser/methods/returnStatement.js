import { RETURN } from '../../Common/constants';
import { Return } from '../ASTNodes/Return';

// return_statement : RETURN expr
export function eatReturnStatement() {
  const returnToken = this.currentToken;
  this.eat(RETURN);
  return new Return(returnToken, this.eatExpr());
}

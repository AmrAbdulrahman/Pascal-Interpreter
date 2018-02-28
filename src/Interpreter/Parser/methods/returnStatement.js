import { RETURN } from '../../constants';
import { Return } from '../../ASTNodes/Return';

// return_statement : RETURN expr
export function eatReturnStatement() {
  this.eat(RETURN);
  return new Return(this.eatExpr());
}

import { ID } from '../../constants';
import { Var } from '../../ASTNodes/*';

// variable: ID
export function eatVariable() {
  const variableNode = new Var(this.currentToken);
  this.eat(ID);

  return variableNode;
}

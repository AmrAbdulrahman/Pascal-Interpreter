import { ASSIGN } from '../../constants';
import { Assign } from '../../ASTNodes/Assign';

// assignment_statement : variable ASSIGN expr
export function eatAssignmentStatement() {

  const leftNode = this.eatVariable();
  this.eat(ASSIGN);
  const rightNode = this.eatExpr();

  return new Assign(leftNode, rightNode);
}

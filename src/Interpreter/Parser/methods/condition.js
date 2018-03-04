import { Condition } from '../ASTNodes/Condition';

// condition: expr
export function eatCondition() {
  return new Condition(this.eatExpr());
}

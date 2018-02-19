import { ASTNode } from './ASTNode';

export class Condition extends ASTNode {
  constructor(expr) {
    super();

    this.expr = expr;
  }

  valueOf() {
    return this.name;
  }
}

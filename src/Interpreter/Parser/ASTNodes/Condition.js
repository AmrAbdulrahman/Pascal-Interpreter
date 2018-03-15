import { ASTNode } from './ASTNode';

export class Condition extends ASTNode {
  constructor(expr) {
    super();

    this.expr = expr;
  }

  valueOf() {
    return `${this.expr}`;
  }

  get from() {
    return this.expr.from;
  }

  get to() {
    return this.expr.to;
  }
}

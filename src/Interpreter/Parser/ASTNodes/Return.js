import { ASTNode } from './ASTNode';

export class Return extends ASTNode {
  constructor(returnToken, expr) {
    super();

    this.returnToken = returnToken;
    this.expr = expr;
  }

  valueOf() {
    return `<${this.name}>`;
  }

  get from() {
    return this.returnToken.from;
  }

  get to() {
    return this.expr.to;
  }
}

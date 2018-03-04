import { ASTNode } from './ASTNode';

export class Return extends ASTNode {
  constructor(expr) {
    super();

    this.expr = expr;
  }

  valueOf() {
    return `<${this.name}>`;
  }
}

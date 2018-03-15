import { ASTNode } from './ASTNode';

export class FunctionInvocation extends ASTNode {
  constructor(id, args, closeBraceToken) {
    super();

    this.id = id;
    this.args = args;
    this.closeBraceToken = closeBraceToken;
  }

  valueOf() {
    return `${this.id.value}(${this.args.map(a => a + '').join(', ')})`;
  }

  get from() {
    return this.id.from;
  }

  get to() {
    return this.closeBraceToken.to;
  }
}

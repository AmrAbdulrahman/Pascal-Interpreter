import { ASTNode } from './ASTNode';

export class Break extends ASTNode {
  constructor(token) {
    super();

    this.token = token;
  }

  valueOf() {
    return `<${this.name}>`;
  }

  get from() {
    return this.token.from;
  }

  get to() {
    return this.token.to;
  }
}

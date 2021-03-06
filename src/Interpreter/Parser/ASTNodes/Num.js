import { ASTNode } from './ASTNode';

export class Num extends ASTNode {
  constructor(token) {
    super();

    this.token = token;
    this.value = token.value;
  }

  valueOf() {
    return this.value;
  }

  get from() {
    return this.token.from;
  }

  get to() {
    return this.token.to;
  }
}

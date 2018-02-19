import { ASTNode } from './ASTNode';

export class Var extends ASTNode {
  constructor(token) {
    super();

    this.token = token;
    this.value = token.value;
  }

  valueOf() {
    return this.value;
  }
}

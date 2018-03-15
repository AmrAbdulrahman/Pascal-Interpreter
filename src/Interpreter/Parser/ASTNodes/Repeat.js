import { ASTNode } from './ASTNode';

export class Repeat extends ASTNode {
  constructor(repeatToken, count, block) {
    super();

    this.repeatToken = repeatToken;
    this.count = count;
    this.block = block;
  }

  valueOf() {
    return '<repeat block>';
  }

  get from() {
    return this.repeatToken.from;
  }

  get to() {
    return this.block.to;
  }
}

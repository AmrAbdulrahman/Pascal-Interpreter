import { ASTNode } from './ASTNode';

export class Repeat extends ASTNode {
  constructor(count, block) {
    super();

    this.count = count;
    this.block = block;
  }

  valueOf() {
    return '<repeat block>';
  }
}

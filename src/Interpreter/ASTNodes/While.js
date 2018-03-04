import { ASTNode } from './ASTNode';

export class While extends ASTNode {
  constructor(condition, block) {
    super();

    this.condition = condition;
    this.block = block;
  }

  valueOf() {
    return '<while block>';
  }
}

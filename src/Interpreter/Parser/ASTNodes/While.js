import { ASTNode } from './ASTNode';

export class While extends ASTNode {
  constructor(whileToken, condition, block) {
    super();

    this.whileToken = whileToken;
    this.condition = condition;
    this.block = block;
  }

  valueOf() {
    return '<while block>';
  }

  get from() {
    return this.whileToken.from;
  }

  get to() {
    return this.block.to;
  }
}

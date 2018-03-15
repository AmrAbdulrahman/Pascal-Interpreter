import { ASTNode } from './ASTNode';

export class Assign extends ASTNode {
  constructor(left, right) {
    super();

    this.left = left;
    this.right = right;
  }

  valueOf() {
    return `${this.left} = ${this.right}`;
  }

  get from() {
    return this.left.from;
  }

  get to() {
    return this.right.to;
  }
}

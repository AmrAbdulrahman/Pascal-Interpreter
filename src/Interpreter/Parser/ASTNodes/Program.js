import { ASTNode } from './ASTNode';

export class Program extends ASTNode {
  constructor(children) {
    super();

    this.children = children;
  }

  valueOf() {
    return this.name.value;
  }
}

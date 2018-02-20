import { ASTNode } from './ASTNode';

export class ScopedBlock extends ASTNode {
  constructor(children) {
    super();

    this.children = children;
  }

  valueOf() {
    return this.name.value;
  }
}

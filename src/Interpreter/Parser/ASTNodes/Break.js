import { ASTNode } from './ASTNode';

export class Break extends ASTNode {
  constructor() {
    super();
  }

  valueOf() {
    return `<${this.name}>`;
  }
}

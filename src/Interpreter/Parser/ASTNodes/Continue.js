import { ASTNode } from './ASTNode';

export class Continue extends ASTNode {
  constructor() {
    super();
  }

  valueOf() {
    return `<${this.name}>`;
  }
}

import { ASTNode } from './ASTNode';

export class ObjectLiteral extends ASTNode {
  constructor(keyValuePairs) {
    super();

    this.children = keyValuePairs;
  }

  valueOf() {
    return this.name.value;
  }
}

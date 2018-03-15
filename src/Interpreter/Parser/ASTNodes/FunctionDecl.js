import { ASTNode } from './ASTNode';

export class FunctionDecl extends ASTNode {
  constructor(id, params, block, functionToken) {
    super();

    this.functionToken = functionToken;
    this.id = id;
    this.params = params;
    this.block = block;
  }

  valueOf() {
    return `<${this.name} (name=${this.id.value})>`;
  }

  get from() {
    return this.functionToken.from;
  }

  get to() {
    return this.block.to;
  }
}

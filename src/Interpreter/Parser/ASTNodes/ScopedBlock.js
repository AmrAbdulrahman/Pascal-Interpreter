import { ASTNode } from './ASTNode';

export class ScopedBlock extends ASTNode {
  constructor(children, openCurlyBraceToken, closeCurlyBraceToken) {
    super();

    this.children = children;
    this.openCurlyBraceToken = openCurlyBraceToken;
    this.closeCurlyBraceToken = closeCurlyBraceToken;
  }

  valueOf() {
    return this.name.value;
  }

  get from() {
    return this.openCurlyBraceToken.from;
  }

  get to() {
    return this.closeCurlyBraceToken.to;
  }
}

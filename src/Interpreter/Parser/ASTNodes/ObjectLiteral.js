import { ASTNode } from './ASTNode';

export class ObjectLiteral extends ASTNode {
  constructor(keyValuePairs, openCurlyBraceToken, closeCurlyBraceToken) {
    super();

    this.children = keyValuePairs;
    this.openCurlyBraceToken = openCurlyBraceToken;
    this.closeCurlyBraceToken = closeCurlyBraceToken;
  }

  valueOf() {
    return 'object-literal';
  }

  get from() {
    return this.openCurlyBraceToken.from;
  }

  get to() {
    return this.closeCurlyBraceToken.to;
  }
}

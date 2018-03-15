import { ASTNode } from './ASTNode';
import { Position } from '../../Common/Position';

export class Str extends ASTNode {
  constructor(token) {
    super();

    this.token = token;
    this.value = token.value;
  }

  valueOf() {
    return this.value;
  }

  get from() {
    // the surrounding single/double quotes
    return new Position(this.token.from.row, this.token.from.col - 2);
  }

  get to() {
    return this.token.to;
  }
}

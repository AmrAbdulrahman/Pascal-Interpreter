import { ASTNode } from './ASTNode';
import { last } from '../../Utils/last';

export class If extends ASTNode {
  constructor(ifToken, ifs, otherwise = null) {
    super();

    this.ifToken = ifToken;
    this.ifs = ifs;
    this.otherwise = otherwise;
  }

  valueOf() {
    return '<if block>';
  }

  get from() {
    return this.ifToken.from;
  }

  get to() {
    if (this.otherwise) {
      return this.otherwise.to;
    }

    return last(this.ifs).body.to;
  }
}

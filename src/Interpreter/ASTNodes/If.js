import { ASTNode } from './ASTNode';

export class If extends ASTNode {
  constructor(ifs, otherwise = null) {
    super();

    this.ifs = ifs;
    this.otherwise = otherwise;
  }

  valueOf() {
    return '<if block>';
  }
}

import { ASTNode } from './ASTNode';
import { last } from '../../Utils/last';

export class Program extends ASTNode {
  constructor(children) {
    super();

    this.children = children;
  }

  valueOf() {
    return this.name.value;
  }

  get from() {
    return this.children[0].from;
  }

  get to() {
    return last(this.children).to;
  }
}

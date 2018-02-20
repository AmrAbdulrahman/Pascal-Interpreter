import { ASTNode } from './ASTNode';

export class NoOp extends ASTNode {
  valueOf() {
    return null;
  }
}

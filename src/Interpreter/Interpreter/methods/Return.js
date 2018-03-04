import { Return } from '../branching/Return';

export function visitReturn(node) {
  return new Return(this.visit(node.expr));
}

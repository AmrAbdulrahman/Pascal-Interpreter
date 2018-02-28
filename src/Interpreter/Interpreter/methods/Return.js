import { Return } from '../Return';

export function visitReturn(node) {
  return new Return(this.visit(node.expr));
}

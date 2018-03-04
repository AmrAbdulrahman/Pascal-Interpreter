import { Return } from '../Return';

export function visitWhile(node) {
  let conditionValue = this.visit(node.condition);

  while (conditionValue === true) {
    const blockValue = this.visit(node.block);

    if (blockValue instanceof Return) {
      return blockValue;
    }

    conditionValue = this.visit(node.condition);
  }
}

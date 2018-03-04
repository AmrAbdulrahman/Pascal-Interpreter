import { Return } from '../branching/Return';
import { Break } from '../branching/Break';
import { Continue } from '../branching/Continue';

export function visitWhile(node) {
  let conditionValue = this.visit(node.condition);

  while (conditionValue === true) {
    const blockValue = this.visit(node.block);

    if (blockValue instanceof Return) {
      return blockValue;
    }

    if (blockValue instanceof Break) {
      break;
    }

    if (blockValue instanceof Continue) {
      // do nothing
    }

    conditionValue = this.visit(node.condition);
  }
}

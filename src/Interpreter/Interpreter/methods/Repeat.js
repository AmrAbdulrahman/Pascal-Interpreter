import { Return } from '../branching/Return';
import { Break } from '../branching/Break';
import { Continue } from '../branching/Continue';

export function visitRepeat(node) {
  const count = this.visit(node.count);

  if (Number.isInteger(count) === false) {
    throw new Error('Parser: expect count to be an integer number');
  }

  for (var i = 0; i < count; i++) {
    const blockValue = this.visit(node.block);

    if (blockValue instanceof Return) {
      return blockValue;
    }

    if (blockValue instanceof Break) {
      break;
    }

    if (blockValue instanceof Continue) {
      // do nothing, continue already terminated any following statements in its block
    }
  }
}

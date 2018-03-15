import { Return } from '../branching/Return';
import { Break } from '../branching/Break';
import { Continue } from '../branching/Continue';

export async function visitWhile(node) {
  if (this.stepByStep) {
    await this.step({
      message: 'while',
      node,
    });
  }

  let conditionValue = await this.visit(node.condition);

  while (conditionValue === true) {
    const blockValue = await this.visit(node.block);

    if (blockValue instanceof Return) {
      return Promise.resolve(blockValue);
    }

    if (blockValue instanceof Break) {
      break;
    }

    if (blockValue instanceof Continue) {
      // do nothing
    }

    conditionValue = await this.visit(node.condition);
  }

  return Promise.resolve();
}

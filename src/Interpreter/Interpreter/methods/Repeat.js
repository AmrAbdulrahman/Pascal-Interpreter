import { Return } from '../Return';

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
  }
}

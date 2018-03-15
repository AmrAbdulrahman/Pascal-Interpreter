import { Break } from '../branching/Break';

export async function visitBreak(node) {
  if (this.stepByStep) {
    await this.step({
      message: 'break',
      node,
    });
  }

  return Promise.resolve(new Break());
}

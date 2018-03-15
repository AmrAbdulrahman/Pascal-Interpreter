import { Continue } from '../branching/Continue';

export async function visitContinue(node) {
  if (this.stepByStep) {
    await this.step({
      message: 'continue',
      node,
    });
  }

  return Promise.resolve(new Continue());
}

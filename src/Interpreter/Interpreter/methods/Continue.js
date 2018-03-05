import { Continue } from '../branching/Continue';

export async function visitContinue() {
  if (this.stepByStep) await this.wait('continue');

  return Promise.resolve(new Continue());
}

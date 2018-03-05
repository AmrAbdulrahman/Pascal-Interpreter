import { Break } from '../branching/Break';

export async function visitBreak() {
  if (this.stepByStep) await this.wait('break');

  return Promise.resolve(new Break());
}

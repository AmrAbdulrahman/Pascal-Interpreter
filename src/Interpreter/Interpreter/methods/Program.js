import { Return } from '../branching/Return';
import { Break } from '../branching/Break';
import { Continue } from '../branching/Continue';

export async function visitProgram(node) {
  const returnValue = await this.visitScopedBlock(node, 'global');

  if (returnValue instanceof Break ||
      returnValue instanceof Continue) {
    throw new Error('Invalid break/continue statement');
  }

  // allow program to have 'return' statements for now
  const result = returnValue instanceof Return ? returnValue.value : returnValue;
  return Promise.resolve(result);
}

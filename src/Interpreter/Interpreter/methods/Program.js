import { Return } from '../branching/Return';
import { Break } from '../branching/Break';
import { Continue } from '../branching/Continue';

export function visitProgram(node) {
  const returnValue = this.visitBlock(node);

  if (returnValue instanceof Break ||
      returnValue instanceof Continue) {
    throw new Error('Invalid break/continue statement');
  }

  // allow program to have 'return' statements for now
  return returnValue instanceof Return ? returnValue.value : returnValue;
}

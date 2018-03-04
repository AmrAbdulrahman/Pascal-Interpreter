import { Return } from '../branching/Return';

export function visitProgram(node) {
  const returnValue = this.visitBlock(node);
  return returnValue instanceof Return ? returnValue.value : returnValue;
}

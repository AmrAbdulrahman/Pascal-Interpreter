export function visitScopedBlock(node) {
  this.openNewScope('block');

  const blockReturnValue = this.visitBlock(node);

  this.closeCurrentScope();

  return blockReturnValue;
};

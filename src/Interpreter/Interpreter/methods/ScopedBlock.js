export async function visitScopedBlock(node) {
  this.openNewScope('block');

  const blockReturnValue = await this.visitBlock(node);

  this.closeCurrentScope();

  return Promise.resolve(blockReturnValue);
};

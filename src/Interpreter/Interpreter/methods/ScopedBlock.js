export async function visitScopedBlock(node, scopeName = 'block') {
  this.openNewScope(scopeName);

  const blockReturnValue = await this.visitBlock(node);

  this.closeCurrentScope();

  return Promise.resolve(blockReturnValue);
};

export async function visitCondition(node) {
  if (this.stepByStep) await this.wait('condition');

  const conditionValue = await this.visit(node.expr);

  return Promise.resolve(!!conditionValue);
}

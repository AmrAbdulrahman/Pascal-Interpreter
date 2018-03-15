export async function visitCondition(node) {
  if (this.stepByStep) {
    await this.step({
      message: `condition (${node})`,
      node,
    });
  };

  const conditionValue = await this.visit(node.expr);

  return Promise.resolve(!!conditionValue);
}

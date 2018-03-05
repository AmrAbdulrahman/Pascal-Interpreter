export async function visitIf(node) {
  if (this.stepByStep) await this.wait('if');

  for (var i = 0; i < node.ifs.length; i++) {
    const { condition, body } = node.ifs[i];
    const conditionValue = await this.visit(condition);

    if (conditionValue === true) {
      return await this.visit(body);
    }
  }

  if (node.otherwise) {
    return await this.visit(node.otherwise);
  }

  return Promise.resolve();
}

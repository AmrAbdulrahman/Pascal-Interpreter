export function visitIf(node) {
  for (var i = 0; i < node.ifs.length; i++) {
    const { condition, body } = node.ifs[i];
    const conditionValue = this.visit(condition);

    if (conditionValue === true) {
      return this.visit(body);
    }
  }

  if (node.otherwise) {
    return this.visit(node.otherwise);
  }
}

export async function visitMemberAccessNode(node) {
  if (this.stepByStep) {
    await this.step({
      message: 'member access',
      node,
    });
  }

  const right = await this.visit(node.right);
  const leftName = node.left.value;

  if (right instanceof Object === false) {
    throw new Error(`Can't call '${leftName}' of '${right}' because '${right}' is not an object`);
  }

  if (Object
      .keys(right)
      .map(k => k.toLowerCase())
      .indexOf(leftName.toLowerCase()) === -1) {

    throw new Error(`object has no property '${leftName}'`);
  }

  return Promise.resolve(right[leftName]);
}

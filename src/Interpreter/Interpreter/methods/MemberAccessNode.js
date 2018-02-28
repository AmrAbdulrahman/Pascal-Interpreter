export function visitMemberAccessNode(node) {
  const right = this.visit(node.right);
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

  return right[leftName];
}

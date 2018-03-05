export async function visitNum(node) {
  if (this.stepByStep) await this.wait(`num ${node.value}`);

  return Promise.resolve(node.value);
}

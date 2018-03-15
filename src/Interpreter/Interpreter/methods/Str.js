export async function visitStr(node) {
  if (this.stepByStep) {
    await this.step({
      message: 'str',
      node,
    });
  }

  return Promise.resolve(node.value);
}

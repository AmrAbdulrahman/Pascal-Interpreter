export async function visitStr(node) {
  if (this.stepByStep) await this.wait('str');

  return Promise.resolve(node.value);
}

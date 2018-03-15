export async function visitNum(node) {
  return Promise.resolve(node.value);
}

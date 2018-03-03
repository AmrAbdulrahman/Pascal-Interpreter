export function visitRepeat(node) {
  const count = this.visit(node.count);

  if (Number.isInteger(count) === false) {
    throw new Error('Parser: expect count to be an integer number');
  }

  for (var i = 0; i < count; i++) {
    this.visit(node.block);
  }
}

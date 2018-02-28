export function visitPrint(node) {
  const output = node.args
    .map(arg => this.visit(arg))
    .map(argVal => argVal instanceof Object ? JSON.stringify(argVal) : argVal)
    .join(' ');

  this.stdout.write(`${output}\n`);
}

export async function visitPrint(node) {
  if (this.stepByStep) {
    await this.step({
      message: 'print',
      node,
    });
  }

  const evaluatedArgs = [];

  for (let i in node.args) {
    evaluatedArgs.push(await this.visit(node.args[i]))
  }

  const output = evaluatedArgs
    .map(argVal => argVal instanceof Object ? JSON.stringify(argVal) : argVal)
    .join(' ');

  this.output(`${output}\n`);

  return Promise.resolve();
}

export async function visitPrint(node) {
  if (this.stepByStep) await this.wait('print');

  const evaluatedArgs = [];

  for (let i in node.args) {
    evaluatedArgs.push(await this.visit(node.args[i]))
  }

  const output = evaluatedArgs
    .map(argVal => argVal instanceof Object ? JSON.stringify(argVal) : argVal)
    .join(' ');

  this.stdout.write(`${output}\n`);

  return Promise.resolve();
}

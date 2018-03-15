export async function visitObjectLiteral(node) {
  if (this.stepByStep) {
    await this.step({
      message: 'object literal',
      node,
    });
  }

  this.openNewScope('object');

  const obj = {};

  for (let i in node.children) {
    const child = node.children[i];

    // calculate the value before declaring the variable
    // to handle dependency on the same variable name
    const value = await this.visit(child.value);

    // declare the variable
    await this.visit(child.key);

    const varName = child.key.variable.value;

    // set variable value in current scope
    this.currentScope
      .lookup(varName)
      .setValue(value);

    // construct object
    obj[varName] = value;
  }

  this.closeCurrentScope();

  return Promise.resolve(obj);
}

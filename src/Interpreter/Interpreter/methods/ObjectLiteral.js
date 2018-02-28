export function visitObjectLiteral(node) {
  this.openNewScope('object');

  const obj = {};

  node.children.forEach(node => {
    // calculate the value before declaring the variable
    // to handle dependency on the same variable name
    const value = this.visit(node.value);

    // declare the variable
    this.visit(node.key);

    const varName = node.key.variable.value;

    // set variable value in current scope
    this.currentScope
      .lookup(varName)
      .setValue(value);

    // construct object
    obj[varName] = value;
  });

  this.closeCurrentScope();

  return obj;
}

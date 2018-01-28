const ASTNode = require('./ASTNode');

module.exports = class VariableDeclaration extends ASTNode {
  constructor(variables, type) {
    super();

    this.variables = variables;
    this.type = type;
  }

  valueOf() {
    return this.children.length;
  }
};

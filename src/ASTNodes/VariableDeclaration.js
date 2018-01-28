const ASTNode = require('./ASTNode');

module.exports = class VariableDeclaration extends ASTNode {
  constructor(variables, type) {
    super();

    this.variables = variables;
    this.type = type;
  }

  get name() {
    return this.constructor.name;
  }

  valueOf() {
    return this.children.length;
  }
};

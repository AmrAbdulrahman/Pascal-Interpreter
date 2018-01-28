const ASTNode = require('./ASTNode');

module.exports = class Block extends ASTNode {
  constructor(declarations, compound) {
    super();

    this.declarations = declarations;
    this.compound = compound;
  }

  get name() {
    return this.constructor.name;
  }

  valueOf() {
    return this.name.value;
  }
}

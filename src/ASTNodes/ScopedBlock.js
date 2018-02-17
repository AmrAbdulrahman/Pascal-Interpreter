const ASTNode = require('./ASTNode');

module.exports = class ScopedBlock extends ASTNode {
  constructor(children) {
    super();

    this.children = children;
  }

  valueOf() {
    return this.name.value;
  }
}

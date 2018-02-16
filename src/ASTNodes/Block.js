const ASTNode = require('./ASTNode');

module.exports = class Block extends ASTNode {
  constructor(children) {
    super();

    this.children = children;
  }

  valueOf() {
    return this.name.value;
  }
}

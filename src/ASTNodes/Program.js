const ASTNode = require('./ASTNode');

module.exports = class Program extends ASTNode {
  constructor(id, block) {
    super();

    if (!(id instanceof ASTNode) || !(block instanceof ASTNode)) {
      throw new Error('name and block must be a ASTNodes');
    }

    this.id = id;
    this.block = block;
  }

  get name() {
    return this.constructor.name;
  }

  valueOf() {
    return this.name.value;
  }
}

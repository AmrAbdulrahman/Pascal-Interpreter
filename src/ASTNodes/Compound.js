const ASTNode = require('./ASTNode');

module.exports = class Compound extends ASTNode {
  constructor() {
    super();

    this.children = [];
  }

  valueOf() {
    return this.children.length;
  }
};

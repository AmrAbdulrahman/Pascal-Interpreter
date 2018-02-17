const ASTNode = require('./ASTNode');

module.exports = class Condition extends ASTNode {
  constructor(expr) {
    super();

    this.expr = expr;
  }

  valueOf() {
    return this.name;
  }
}

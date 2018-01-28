const ASTNode = require('./ASTNode');

module.exports = class NoOp extends ASTNode {
  valueOf() {
    return null;
  }
}

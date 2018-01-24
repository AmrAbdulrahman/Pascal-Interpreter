const ASTNode = require('./ASTNode');

module.exports = class NoOp extends ASTNode {
  get name() {
    return 'NoOp';
  }

  valueOf() {
    return null;
  }
}

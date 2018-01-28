const ASTNode = require('./ASTNode');

module.exports = class BinOp extends ASTNode {
  constructor(left, op, right) {
    super();

    if (!(left instanceof ASTNode) || !(right instanceof ASTNode)) {
      throw new Error('left and right nodes must be an AST instances');
    }

    this.left = left;
    this.right = right;
    this.token = this.op = op;
  }

  valueOf() {
    return this.op.value;
  }
}

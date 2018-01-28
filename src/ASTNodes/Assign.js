const ASTNode = require('./ASTNode');

module.exports = class Assign extends ASTNode {
  constructor(left, op, right) {
    super();

    this.left = left;
    this.right = right;
    this.token = this.op = op;
  }

  valueOf() {
    return `${this.left} = ${this.right}`;
  }
}

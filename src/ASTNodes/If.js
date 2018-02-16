const ASTNode = require('./ASTNode');

module.exports = class If extends ASTNode {
  constructor(ifs, otherwise = null) {
    super();

    this.ifs = ifs;
    this.otherwise = otherwise;
  }

  valueOf() {
    return '<if block>';
  }
}

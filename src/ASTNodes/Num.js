const ASTNode = require('./ASTNode');

module.exports = class Num extends ASTNode {
  constructor(token) {
    super();

    this.token = token;
    this.value = token.value;
  }

  get name() {
    return 'Num';
  }

  valueOf() {
    return this.value;
  }
}

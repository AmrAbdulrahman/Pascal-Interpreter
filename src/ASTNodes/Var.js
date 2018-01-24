const ASTNode = require('./ASTNode');

module.exports = class Var extends ASTNode {
  constructor(token) {
    super();

    this.token = token;
    this.value = token.value;
  }

  get name() {
    return 'Var';
  }

  valueOf() {
    return this.value;
  }
}

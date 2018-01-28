const ASTNode = require('./ASTNode');

module.exports = class Type extends ASTNode {
  constructor(token) {
    super();

    this.token = token;
    this.value = token.value;
  }

  valueOf() {
    return this.value;
  }
}

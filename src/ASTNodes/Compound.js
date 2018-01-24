const ASTNode = require('./ASTNode');

module.exports = class Compound extends ASTNode {
  constructor() {
    super();
    
    this.children = [];
  }

  get name() {
    return 'Compound';
  }

  valueOf() {
    return this.children.length;
  }
};

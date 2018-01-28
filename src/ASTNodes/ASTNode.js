module.exports = class ASTNode {
  get name() {
    return this.constructor.name;
  }

  valueOf() {
    throw new Error('ASTNode must implement the valueOf method');
  }
};

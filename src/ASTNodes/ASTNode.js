module.exports = class ASTNode {
  get name() {
    throw new Error('ASTNode must implement the name getter or property');
  }

  valueOf() {
    throw new Error('ASTNode must implement the valueOf method');
  }
};

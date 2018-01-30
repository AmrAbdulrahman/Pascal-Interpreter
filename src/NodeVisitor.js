module.exports = class NodeVisitor {
  visit(node) {
    const methodName = node.name;

    if (this[`visit${methodName}`]) {
      return this[`visit${methodName}`](node);
    }

    throw new Error(`a method visit${methodName} is missing`);
  }
};

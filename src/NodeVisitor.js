export class NodeVisitor {
  visit(node) {
    const methodName = node.name;

    if (Array.isArray(node)) {
      node.forEach(elem => this.visit(elem));
      return;
    }

    if (this[`visit${methodName}`]) {
      return this[`visit${methodName}`](node);
    }

    throw new Error(`a method visit${methodName} is missing`);
  }
};

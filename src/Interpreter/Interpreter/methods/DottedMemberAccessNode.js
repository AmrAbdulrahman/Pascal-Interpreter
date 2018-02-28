export function visitDottedMemberAccessNode(node) {
  // WARNING!
  // take care that the SemanticAnalyzer already swapped
  // node.left and node.right

  return this.visitMemberAccessNode(node);
}

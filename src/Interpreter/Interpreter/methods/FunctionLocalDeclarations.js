import { VariableDeclaration } from '../../ASTNodes/*';

export function visitFunctionLocalDeclarations(node) {
  for (let index in node.children) {
    const statement = node.children[index];

    // declare variables
    if (statement instanceof VariableDeclaration) {
      this.visit(statement);
    }
  }
}

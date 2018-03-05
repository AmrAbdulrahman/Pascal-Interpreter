import { VariableDeclaration } from '../../Parser/ASTNodes/*';

export async function visitFunctionLocalDeclarations(node) {
  for (let index in node.children) {
    const statement = node.children[index];

    // declare variables
    if (statement instanceof VariableDeclaration) {
      await this.visit(statement);
    }
  }

  return Promise.resolve();
}

import { Return } from '../Return';

export function visitBlock(node) {
  for (let index in node.children) {
    const statement = node.children[index];
    const statementValue = this.visit(statement);

    if (statementValue instanceof Return) {
      return statementValue;
    }
  }
};

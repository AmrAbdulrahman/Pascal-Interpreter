import { Return } from '../branching/Return';
import { Break } from '../branching/Break';
import { Continue } from '../branching/Continue';

export function visitBlock(node) {
  for (let index in node.children) {
    const statement = node.children[index];
    const statementValue = this.visit(statement);

    if (statementValue instanceof Return ||
        statementValue instanceof Break ||
        statementValue instanceof Continue) {
      return statementValue;
    }
  }
};

import { Return } from '../branching/Return';
import { Break } from '../branching/Break';
import { Continue } from '../branching/Continue';

export async function visitBlock(node) {
  if (this.stepByStep) await this.wait('block');

  for (let index in node.children) {
    const statement = node.children[index];
    const statementValue = await this.visit(statement);

    if (statementValue instanceof Return ||
        statementValue instanceof Break ||
        statementValue instanceof Continue) {
      return Promise.resolve(statementValue);
    }
  }

  return Promise.resolve();
};

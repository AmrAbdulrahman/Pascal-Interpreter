import { Return } from '../branching/Return';

export async function visitReturn(node) {
  if (this.stepByStep) {
    await this.step({
      message: `return '${node.expr}'`,
      node,
    });
  }

  const exprValue = await this.visit(node.expr);
  const returnValue = new Return(exprValue);

  return Promise.resolve(returnValue);
}

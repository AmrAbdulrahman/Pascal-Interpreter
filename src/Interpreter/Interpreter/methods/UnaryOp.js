import { PLUS, NAMEOF } from '../../Common/constants';
import { Var } from '../../Parser/ASTNodes/Var';

export async function visitUnaryOp(node) {
  if (this.stepByStep) {
    await this.step({
      message: 'unary op',
      node,
    });
  }

  if (node.op.type === NAMEOF) {
    if (node.expr instanceof Var) {
      return Promise.resolve(node.expr.token.value);
    }

    throw new Error('nameof expects a variable as an argument.');
  }

  const exprValue = await this.visit(node.expr);
  const returnValue = (node.op.type === PLUS ? 1 : -1) * exprValue;

  return Promise.resolve(returnValue);
}

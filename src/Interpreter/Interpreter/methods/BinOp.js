import {
  PLUS,
  MINUS,
  MULTIPLY,
  DIVISION,
  EQUALS,
  NOT_EQUALS,
  AND,
  OR,
  LESS_THAN,
  GREATER_THAN,
  LESS_THAN_OR_EQUAL,
  GREATER_THAN_OR_EQUAL,
  OF,
  DOT,
} from '../../Common/constants';

export async function visitBinOp(node) {
  if (this.stepByStep) {
    await this.step({
      message: `resolving '${node}'`,
      node,
    });
  };

  if (node.op.type === OF) {
    return await this.visitMemberAccessNode(node);
  }

  if (node.op.type === DOT) {
    return await this.visitDottedMemberAccessNode(node);
  }

  const left = await this.visit(node.left);
  const right = await this.visit(node.right);
  let res;

  switch (node.op.type) {
    case PLUS:
      res = left + right; break;
    case MINUS:
      res = left - right; break;
    case MULTIPLY:
      res = left * right; break;
    case DIVISION:
      res = left / right; break;
    case EQUALS:
      res = left === right; break;
    case NOT_EQUALS:
      res = left !== right; break;
    case AND:
      res = !!(left && right); break;
    case OR:
      res = !!(left || right); break;
    case LESS_THAN:
      res = left < right; break;
    case GREATER_THAN:
      res = left > right; break;
    case LESS_THAN_OR_EQUAL:
      res = left <= right; break;
    case GREATER_THAN_OR_EQUAL:
      res = left >= right; break;

    default:
      throw new Error(`Unhandled operator type ${node.op.type}`);
  }

  return Promise.resolve(res);
}

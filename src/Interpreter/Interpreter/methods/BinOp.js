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
} from '../../constants';

export function visitBinOp(node) {
  if (node.op.type === OF) {
    return this.visitMemberAccessNode(node);
  }

  const left = this.visit(node.left);
  const right = this.visit(node.right);

  switch (node.op.type) {
    case PLUS:
      return left + right;
    case MINUS:
      return left - right;
    case MULTIPLY:
      return left * right;
    case DIVISION:
      return left / right;
    case EQUALS:
      return left === right;
    case NOT_EQUALS:
      return left !== right;
    case AND:
      return !!(left && right);
    case OR:
      return !!(left || right);
    case LESS_THAN:
      return left < right;
    case GREATER_THAN:
      return left > right;
    case LESS_THAN_OR_EQUAL:
      return left <= right;
    case GREATER_THAN_OR_EQUAL:
      return left >= right;

    default:
      throw new Error(`Unhandled operator type ${node.op.type}`);
  }
}

import { BinOp } from '../../Parser/ASTNodes/BinOp';

export function visitDottedMemberAccessNode(node) {
  node = new BinOp(node.right, node.op, node.left); // swap left and right
  return this.visitMemberAccessNode(node);
}

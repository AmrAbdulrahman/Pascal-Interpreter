import { BinOp } from '../../Parser/ASTNodes/BinOp';

export async function visitDottedMemberAccessNode(node) {
  node = new BinOp(node.right, node.op, node.left); // swap left and right

  return await this.visitMemberAccessNode(node);
}

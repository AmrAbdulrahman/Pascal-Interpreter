import { last } from '../../Utils/*';
import { EOF } from '../../constants';
import { NoOp } from '../../ASTNodes/NoOp';

// statement_list : statement*
export function eatStatementList() {
  const nodes = [];

  do {
    nodes.push(this.eatStatement());
  } while (this.currentToken.is(EOF) === false &&
           last(nodes) instanceof NoOp === false);

  return nodes;
}

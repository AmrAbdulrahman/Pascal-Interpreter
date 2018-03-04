import { ASSIGN, COLON } from '../../Common/constants';
import { VariableDeclaration, Assign } from '../ASTNodes/*';

// variable_declaration_and_possible_assignment : ID (= expr)?
export function eatVariableDeclarationAndAssignment() {
  const varNode = this.eatVariable();
  const variableDeclarationNode = new VariableDeclaration(varNode, null);
  const nodes = [variableDeclarationNode];

  if (this.currentToken.is(ASSIGN, COLON)) {
    this.eat(ASSIGN, COLON);

    const expr = this.eatExpr();
    const assignNode = new Assign(varNode, expr);

    nodes.push(assignNode);
  }

  return nodes;
}

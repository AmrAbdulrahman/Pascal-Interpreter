import { concat } from '../../Utils/*';
import { COMMA } from '../../Common/constants';

// variables_list: variable_declaration (COMMA variable_declaration)*
export function eatVariablesList() {
  const nodes = this.eatVariableDeclarationAndAssignment();

  while (this.currentToken.is(COMMA)) {
    this.eat(COMMA);
    concat(nodes, this.eatVariableDeclarationAndAssignment());
  }

  return nodes;
}

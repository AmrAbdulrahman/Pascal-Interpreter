import { CREATE } from '../../Common/constants';

// variable_declaration : CREATE variables_list
export function eatVariablesDeclaration() {
  this.eat(CREATE);

  return this.eatVariablesList();
}

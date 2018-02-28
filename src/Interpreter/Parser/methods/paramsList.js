import { COMMA } from '../../constants';

// variables_list: variable (COMMA variable)*
export function eatParamsList() {
  const nodes = [this.eatVariable()];

  while (this.currentToken.is(COMMA)) {
    this.eat(COMMA);
    nodes.push(this.eatVariable());
  }

  return nodes;
}

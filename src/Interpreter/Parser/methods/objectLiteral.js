import { OPEN_CURLY_BRACE, CLOSE_CURLY_BRACE, ID, COLON, ASSIGN, COMMA } from '../../constants';
import { VariableDeclaration, ObjectLiteral } from '../../ASTNodes/*';

// object_literal: OPEN_CURLY_BRACE (ID COLON|ASSIGN expr COMMA)* CLOSE_CURLY_BRACE
export function eatObjectLiteral() {
  const nodes = [];

  this.eat(OPEN_CURLY_BRACE);

  while (this.currentToken.is(ID)) {
    const variable = this.eatVariable();

    if (this.currentToken.is(COLON)) {
      this.eat(COLON);
    } else {
      this.eat(ASSIGN);
    }

    nodes.push({
      key: new VariableDeclaration(variable),
      value: this.eatExpr(),
    });

    // if comma, continue, else close
    if (this.currentToken.is(COMMA)) {
      this.eat(COMMA);
    } else {
      break;
    }
  }

  this.eat(CLOSE_CURLY_BRACE);

  return new ObjectLiteral(nodes);
}

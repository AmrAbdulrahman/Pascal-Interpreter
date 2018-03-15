import { OPEN_CURLY_BRACE, CLOSE_CURLY_BRACE, ID, COLON, ASSIGN, COMMA } from '../../Common/constants';
import { VariableDeclaration, ObjectLiteral } from '../ASTNodes/*';

// object_literal: OPEN_CURLY_BRACE (ID COLON|ASSIGN expr COMMA)* CLOSE_CURLY_BRACE
export function eatObjectLiteral() {
  const nodes = [];

  const openCurlyBraceToken = this.currentToken;
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

  const closeCurlyBraceToken = this.currentToken;
  this.eat(CLOSE_CURLY_BRACE);

  return new ObjectLiteral(nodes, openCurlyBraceToken, closeCurlyBraceToken);
}

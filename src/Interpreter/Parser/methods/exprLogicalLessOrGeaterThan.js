import { LESS, GREATER, THAN, OR, EQUAL, LESS_THAN_OR_EQUAL,
         GREATER_THAN_OR_EQUAL, LESS_THAN, GREATER_THAN } from '../../Common/constants';
import { BinOp } from '../ASTNodes/BinOp';
import { Token } from '../../Lexer/Token';

// expr_logical_less_or_geater_than: something ((LESS_THAN | GREETER_THAN | LESS_THAN_OR_EQUAL | GREATER_THAN_OR_EQUAL) something)*
export function eatExprLogicalLessOrGeaterThan() {
    const MYSELF = 'eatExprLogicalLessOrGeaterThan';
    let left = this.eatHigherPrecedenceExprOf(MYSELF);

    while (this.currentToken.is(LESS, GREATER)) {
      const isLess = this.currentToken.is(LESS);
      let operatorKey,
          operatorValue;

      this.eat(LESS, GREATER);
      this.eat(THAN);

      if (this.currentToken.is(OR)) {
        this.eat(OR);
        this.eat(EQUAL);

        operatorKey = isLess ? LESS_THAN_OR_EQUAL : GREATER_THAN_OR_EQUAL;
        operatorValue = isLess ? 'less than or equal' : 'greater than or equal';
      } else {
        operatorKey = isLess ? LESS_THAN : GREATER_THAN;
        operatorValue = isLess ? 'less than' : 'greater than';
      }

      const operator = new Token(operatorKey, operatorValue);
      const right = this.eatHigherPrecedenceExprOf(MYSELF);

      left = new BinOp(left, operator, right);
    }

    return left;
  }

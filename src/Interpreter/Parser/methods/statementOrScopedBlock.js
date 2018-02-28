import { OPEN_CURLY_BRACE } from '../../constants';

// statement_or_block : (statement SEMI?) | scoped_block
export function eatStatementOrScopedBlock() {
  if (this.currentToken.is(OPEN_CURLY_BRACE)) {
    return this.eatScopedBlock();
  } else {
    return this.eatStatement();
  }
}

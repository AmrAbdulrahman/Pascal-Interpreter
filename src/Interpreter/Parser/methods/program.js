import { Program } from '../ASTNodes/Program';

// program : statement_list
export function eatProgram() {
  return new Program(this.eatStatementList());
}

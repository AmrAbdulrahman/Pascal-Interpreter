import { NoOp } from '../../ASTNodes/NoOp';

// empty: NoOp
export function eatEmpty() {
  return new NoOp();
}

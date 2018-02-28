export function eatExpr() {
  return this.eatHigherPrecedenceExprOf('eatExpr');
}

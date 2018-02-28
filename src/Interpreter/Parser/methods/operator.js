export function eatOperator(...types) {
  const operatorToken = this.currentToken;
  this.eat(...types);
  return operatorToken;
}

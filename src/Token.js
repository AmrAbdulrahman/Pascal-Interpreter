class Token {
  constructor(type, value, rowNumber, colNumber) {
    this.type = type;
    this.value = value;
    this.rowNumber = rowNumber;
    this.colNumber = colNumber;
  }

  toString() {
    return `Token(${this.type}, ${this.value})`;
  }

  repr() {
    return this.toString();
  }

  is(...types) {
    return types.indexOf(this.type) !== -1;
  }
}

module.exports = Token;

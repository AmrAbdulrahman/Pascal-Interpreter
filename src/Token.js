class Token {
  constructor(type, value, rowIndex, colIndex) {
    this.type = type;
    this.value = value;
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
  }

  toString() {
    return `Token(${this.type}, ${this.value})`;
  }

  getLocation() {
    return `(${this.rowIndex + 1}:${this.colIndex + 1})`;
  }

  repr() {
    return this.toString();
  }

  is(...types) {
    return types.indexOf(this.type) !== -1;
  }
}

module.exports = Token;

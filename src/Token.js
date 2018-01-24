class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
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

module.exports = class BaseSymbol {
  constructor(name, type = null) {
    this.name = name;
    this.type = type;
  }

  toString() {
    return `<${this.constructor.name} ${this.name}>`;
  }
}

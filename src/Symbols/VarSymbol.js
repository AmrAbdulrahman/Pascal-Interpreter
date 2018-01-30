const BaseSymbol = require('./BaseSymbol');

module.exports = class VarSymbol extends BaseSymbol {
  constructor(name, type) {
    super(name, type);
  }

  toString() {
    return `<${this.name}:${this.type}>`;
  }
};

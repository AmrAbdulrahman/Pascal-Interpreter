const BaseSymbol = require('./BaseSymbol');

module.exports = class VarSymbol extends BaseSymbol {
  constructor(name, type) {
    super(name, type);
  }

  toString() {
    return `<${this.constructor.name} (name=${this.name}, type=${this.type})>`;
  }
};

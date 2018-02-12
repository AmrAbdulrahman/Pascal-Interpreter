const BaseSymbol = require('./BaseSymbol');

module.exports = class VarSymbol extends BaseSymbol {
  constructor(name, type, value) {
    super(name, type);

    this.value = value;
  }

  setValue(value) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }

  toString() {
    return `<${this.constructor.name} (name=${this.name}, type=${this.type})>`;
  }
};

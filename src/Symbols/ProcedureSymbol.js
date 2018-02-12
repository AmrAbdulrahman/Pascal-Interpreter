const BaseSymbol = require('./BaseSymbol');

module.exports = class ProcedureSymbol extends BaseSymbol {
  constructor(name, block, params = []) {
    super(name);

    this.block = block;
    this.params = params;
  }

  toString() {
    return `<${this.constructor.name} (name=${this.name})>`;
  }
};

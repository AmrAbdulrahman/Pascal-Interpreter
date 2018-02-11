const BaseSymbol = require('./BaseSymbol');

module.exports = class ProcedureSymbol extends BaseSymbol {
  constructor(name, params = []) {
    super(name);

    this.params = params;
  }

  toString() {
    return `<${this.constructor.name} (name=${this.name})>`;
  }
};

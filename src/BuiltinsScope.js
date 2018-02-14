const Scope = require('./Scope');
const BuiltinTypeSymbol = require('./Symbols/BuiltinTypeSymbol');
const { INTEGER, REAL, STRING } = require('./constants');

module.exports = class BuiltinsScope extends Scope {
  constructor() {
    super('builtins');

    this.init();
  }

  init() {
    this.insert(new BuiltinTypeSymbol(INTEGER));
    this.insert(new BuiltinTypeSymbol(REAL));
    this.insert(new BuiltinTypeSymbol(STRING));
  }
};

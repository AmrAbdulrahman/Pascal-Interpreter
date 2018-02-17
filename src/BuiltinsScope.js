const Scope = require('./Scope');
const BuiltinTypeSymbol = require('./Symbols/BuiltinTypeSymbol');
const BuiltinVarSymbol = require('./Symbols/BuiltinVarSymbol');
const { INTEGER, REAL, STRING, BOOLEAN } = require('./constants');

module.exports = class BuiltinsScope extends Scope {
  constructor() {
    super('builtins');

    this.init();
  }

  init() {
    this.initTypes();
    this.initVars();
  }

  initTypes() {
    this.insert(new BuiltinTypeSymbol(INTEGER));
    this.insert(new BuiltinTypeSymbol(REAL));
    this.insert(new BuiltinTypeSymbol(STRING));
    this.insert(new BuiltinTypeSymbol(BOOLEAN));
  }

  initVars() {
    const boolean = this.lookup(BOOLEAN);

    this.insert(new BuiltinVarSymbol('true', boolean, true));
    this.insert(new BuiltinVarSymbol('false', boolean, false));
    this.insert(new BuiltinVarSymbol('null', null, null));
  }
};

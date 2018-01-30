const BuiltinTypeSymbol = require('./BuiltinTypeSymbol');

module.exports = class SymbolTable {
  constructor() {
    this.symbols = {};
    this.initBuiltins();
  }

  initBuiltins() {
    this.initBuiltinTypes();
  }

  initBuiltinTypes() {
    this.define(new BuiltinTypeSymbol('INTEGER'));
    this.define(new BuiltinTypeSymbol('REAL'));
  }

  toString() {
    return `Symbols ${this.keys.map(key => this.symbols[key]).join(', ')}`
  }

  define(symbol) {
    console.log('Define', symbol.toString());
    this.symbols[symbol.name] = symbol;
  }

  lookup(name) {
    console.log('Lookup', name);
    return this.symbols[name];
  }

  get keys() {
    return Object.keys(this.symbols);
  }
};

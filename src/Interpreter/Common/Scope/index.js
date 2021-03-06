import { span } from '../../Utils/span';
import { VarSymbol } from '../Symbols/VarSymbol';

export class Scope {
  constructor(scopeName, parent = null) {
    this.symbols = {};
    this.scopeName = scopeName;
    this.scopeLevel = parent ? parent.scopeLevel + 1 : 0;
    this.parent = parent;
  }

  toString() {
    return `SCOPE (name=${this.scopeName}) (level=${this.scopeLevel})\n${
      this.keys.map(key => span(key, 8) + ' : ' + this.symbols[key]).join('\n')
    }`;
  }

  insert(symbol) {
    return this.symbols[symbol.name] = symbol;
  }

  lookup(name) {
    if (this.symbols[name]) {
      return this.symbols[name];
    }

    if (this.parent) {
      return this.parent.lookup(name);
    }

    return null;
  }

  has(name) {
    return !!this.symbols[name];
  }

  getOwnVarSymbols() {
    return this.keys
      .map(key => this.symbols[key])
      .filter(symbol => symbol instanceof VarSymbol);
  }

  get keys() {
    return Object.keys(this.symbols);
  }

  valueOf() {
    return this.scopeName;
  }
};

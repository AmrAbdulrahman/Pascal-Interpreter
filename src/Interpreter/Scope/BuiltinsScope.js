import { Scope } from '.';
import { BuiltinTypeSymbol, BuiltinVarSymbol } from '../Symbols/*';
import { INTEGER, REAL, STRING, BOOLEAN } from '../constants';

export class BuiltinsScope extends Scope {
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

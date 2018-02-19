import { VarSymbol } from './VarSymbol';

export class BuiltinVarSymbol extends VarSymbol {
  constructor(name, type, value) {
    super(name, type, value);
  }
};

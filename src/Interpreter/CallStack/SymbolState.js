import { VarSymbol } from '../Symbols/VarSymbol';

export class SymbolState {
  constructor(symbol) {
    if (symbol instanceof VarSymbol === false) {
      throw new Error('Internal: symbol has to be an instanceof VarSymbol');
    }

    this.symbol = symbol;
    this.value = symbol.value;
  }
}

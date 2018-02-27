import { Stack } from './Stack';
import { SymbolState } from './SymbolState';

export class CallStack {
  constructor() {
    this.stack = new Stack();
  }

  push(varSymbols) {
    const symbolsState = [];

    varSymbols.forEach(symbol => {
      symbolsState.push(new SymbolState(symbol));
    });

    this.stack.push(symbolsState);
  }

  pull() {
    const symbolsState = this.stack.pull();

    symbolsState.forEach(({symbol, value}) => {
      symbol.setValue(value);
    });
  }
}

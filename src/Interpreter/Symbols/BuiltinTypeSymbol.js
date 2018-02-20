import { BaseSymbol } from './BaseSymbol';

export class BuiltinTypeSymbol extends BaseSymbol {
  constructor(name) {
    super(name);
  }

  toString() {
    return `<${this.constructor.name} (name=${this.name})>`;
  }
};

import { BaseSymbol } from './BaseSymbol';

export class FunctionSymbol extends BaseSymbol {
  constructor(name, block, params = []) {
    super(name);

    this.block = block;
    this.params = params;
  }

  setScope(scope) {
    this.scope = scope;
  }

  getScope() {
    return this.scope;
  }

  toString() {
    return `<${this.constructor.name} (name=${this.name})>`;
  }
};

const VarSymbol = require('./VarSymbol');

module.exports = class BuiltinVarSymbol extends VarSymbol {
  constructor(name, type, value) {
    super(name, type, value);
  }
};

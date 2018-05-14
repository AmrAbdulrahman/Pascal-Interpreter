import React, { Component } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import VarSymbolComponent from './VarSymbol';
import FunctionSymbolComponent from './FunctionSymbol';

import {
  FunctionSymbol,
  VarSymbol,
} from '../../Interpreter/Common/Symbols/*';

import './styles.css';

class Scope extends Component {
  renderSymbol(symbol, index) {
    if (symbol instanceof VarSymbol) {
      return <VarSymbolComponent key={index} symbol={symbol} />;
    }

    if (symbol instanceof FunctionSymbol) {
      return <FunctionSymbolComponent key={index} symbol={symbol} />;
    }

    throw new Error('Unhandled symbol type');
  }

  renderSymbols() {
    const { scope } = this.props;

    if (Object.keys(scope.symbols).length === 0) {
      return null;
    }

    console.log(scope.symbols);

    return (
      <div className='symbols'>
        {map(scope.symbols, (symbol, index) => this.renderSymbol(symbol, index))}
      </div>
    );
  }

  render() {
    const { scope } = this.props;

    if (!scope) {
      return null;
    }

    return (
      <div className='scope'>
        <div className='scope-name'>{`[${scope.scopeName}] Scope`}</div>
        {this.renderSymbols()}
        <Scope scope={scope.childScope} />
      </div>
    );
  }
}

Scope.propTypes = {
  scope: PropTypes.object,
}

export default Scope;

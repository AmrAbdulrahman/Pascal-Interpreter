import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './styles.css';

class VarSymbol extends Component {
  render() {
    const { symbol } = this.props;
    const valueString = JSON.stringify(symbol.getValue(), null, 2);

    return (
      <div className='symbol var'>
        <div className='symbol-name'>{symbol.name}</div>
        <div className={classnames('symbol-value', {empty: !valueString})}>{valueString || 'No value'}</div>
      </div>
    );
  }
}

VarSymbol.propTypes = {
  symbol: PropTypes.any.isRequired,
}

export default VarSymbol;

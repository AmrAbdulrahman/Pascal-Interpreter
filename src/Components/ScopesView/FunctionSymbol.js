import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './styles.css';

class FunctionSymbol extends Component {
  renderParams() {
    const { symbol } = this.props;
    const params = symbol.params;

    if (!params.length) {
      return (
        <div className='params'>
          {`Doesn't require any arguments`}
        </div>
      );
    }

    return (
      <div className='params'>
        Takes <span className='param-names'>{params.map(param => param.name).join(', ')}</span> as parameters
      </div>
    )
  }
  render() {
    const { symbol } = this.props;

    return (
      <div className='symbol function'>
        <div className='symbol-name'>{symbol.name}</div>
        {this.renderParams()}
      </div>
    );
  }
}

FunctionSymbol.propTypes = {
  symbol: PropTypes.any.isRequired,
}

export default FunctionSymbol;

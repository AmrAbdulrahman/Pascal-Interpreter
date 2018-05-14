import React, { Component } from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import Scope from './Scope';

import './styles.css';

class ScopesView extends Component {
  _getRootScope = scope => {
    const { displayBuiltins } = this.props;
    const scopes = [ scope ]; // child ... root

    while (scope.parent !== null) {
      scopes.push(scope.parent);
      scope = scope.parent;
    }

    for (var i = scopes.length - 1; i > 0; i--) {
      scopes[i].childScope = scopes[i - 1];
    }

    const rootScopeIndex = displayBuiltins ? scopes.length - 1 : scopes.length - 2;

    return scopes[rootScopeIndex];
  };

  render() {
    const { step, logs } = this.props;

    if (!step || !step.scope) {
      return <span>Waiting...</span>;
    }

    const currentScope = step.scope;
    const rootScope = this._getRootScope(step.scope);
    const lastLogMessage = get(logs, `${logs.length - 1}.message`, 'Output...');

    return (
      <div className='scopesView'>
        <div className='log'>{`> ${lastLogMessage}`}</div>
        <div className='scopesWrapper'>
          <Scope scope={rootScope} />
        </div>
      </div>
    );
  }
}

ScopesView.defaultProps = {
  displayBuiltins: false,
  logs: [],
};

export default ScopesView;

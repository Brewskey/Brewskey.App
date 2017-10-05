// @flow

import * as React from 'react';
import { withNavigation } from 'react-navigation';
import { inject, observer } from 'mobx-react';

// todo work only on app intializetion, after that tabNavigator don't rerender
// screens so componentwillMount isnn't invoked
const requireAuth = BaseComponent =>
  @inject(['authStore'])
  @observer
  @withNavigation
  class RequireAuth extends React.Component {
    componentWillMount() {
      if (!this.props.authStore.isAuthorized) {
        this.props.navigation.navigate('login');
      }
    }
    render() {
      return <BaseComponent {...this.props} />;
    }
  };

export default requireAuth;

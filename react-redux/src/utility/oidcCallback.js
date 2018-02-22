import React from 'react';
import { CallbackComponent } from 'redux-oidc';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

class oidcCallback extends React.Component {

  // define a success callback which receives the signed in user & handles redirection
  // NOTE: this example uses react-router-redux,
  // but any other routing library should work the same
  successCallback = (user) => {
    // the user object gets the browser's URL before
    // redirection was triggered passed into its state
    // when triggerAuthFlow is set to `true`
    const urlBeforeRedirection = user.state.redirectUrl;
    this.props.dispatch(push(urlBeforeRedirection));
  };

  render() {
    return <CallbackComponent successCallback={this.successCallback} />;
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}

export default connect(null, mapDispatchToProps)(oidcCallback);

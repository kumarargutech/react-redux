import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getData } from '../actions/personal';
import AppComponent from '../components/AppComponent';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {       
    };    
  }

  componentDidMount() {
    this.props.dispatch(getData());
  }

  render() {
    return (
      <div>
         <AppComponent value={this.props.personalData} />
      </div>
    );
  }
}

export default connect((state) => {
  const personalData = state.setPersonalData;  
  return {
      personalData      
  };
})(App);

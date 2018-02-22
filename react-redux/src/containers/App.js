import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getData } from '../actions/personal';
import AppComponent from '../components/AppComponent';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
       data : [{
          'id' : 1,
          'name' : 'Kumar',
          'source' : 'ReactJS'
       },
       {
        'id' : 2,
        'name' : 'Santhosh',
        'source' : 'ReactJS'
     }]
    };    
  }

  componentWillMount() {
    this.props.dispatch(getData());
  }

  render() {
    return (
      <div>
         <AppComponent value={this.state.data} />
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

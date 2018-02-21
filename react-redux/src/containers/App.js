import React, { Component } from 'react';
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

  render() {
    return (
      <AppComponent value={this.state.data} />
    );
  }
}

export default App;

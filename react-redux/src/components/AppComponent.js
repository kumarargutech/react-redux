import React, { Component } from 'react';
import '../assets/App.css';
import 'bootstrap/dist/css/bootstrap.css';

class AppComponent extends Component {

  constructor(props) {
    super(props);
    console.log(this.props.value);
  }

  renderData() {
    return this.props.value.map(function(item) {
      return (<tr>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.source}</td>
            <td><button className="btn btn-success">Edit</button>
            <button className="btn btn-warning">Delete</button>
            </td>
        </tr>)
    })
  }

  render() {
    return (
      <div className="App">
        <table className="table table-bordered table-responsive">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Source</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>  
            {this.renderData()}      
          </tbody>
        </table> 
      </div>
    );
  }
}

export default AppComponent;

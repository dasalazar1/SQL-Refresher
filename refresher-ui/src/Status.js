import React, { Component } from "react";
import http from 'http';
 
class Status extends Component {
  constructor(props) {
    super(props);
    this.state = {status: ''};

  }

  getStatus(){
    var url = '/status';
    http.get(url, function(res){
        var js = JSON.stringify(res.body);
        this.setState({status: js});
    });

    // fetch('/status')
    //   .then(results => {
    //     var js = JSON.stringify(results.body);
    //     this.setState({status: js});
    //   })
  };

  componentDidMount() {

    this.interval = setInterval(() => {
      fetch('/status')
      .then(response => {console.log(response); return response.json();})
      .then(data => this.setState({ status: data.status }));
    }, 1000);

  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    //this.getStatus();
    //console.log(this.getStatus());
    return (
      <div>
        <label>{this.state.status}</label>
      </div>
    );
  }
}
 
export default Status;
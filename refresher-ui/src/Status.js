import React, { Component } from "react";
import http from "http";

class Status extends Component {
  constructor(props) {
    super(props);
    this.state = { status: "", percent: "" };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      fetch("/status")
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(data => {
          this.setState({ status: data.step, percent: data.percent });
          if (data.percent == 100) clearInterval(this.interval);
        })
        .catch(err => {
          console.error(err);
          clearInterval(this.interval);
        });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <label>{this.state.percent}</label>
      </div>
    );
  }
}

export default Status;

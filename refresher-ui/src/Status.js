import React, { Component } from "react";
import Link from "react-router-dom/Link";
import { Redirect } from "react-router-dom";

class Status extends Component {
  constructor(props) {
    super(props);
    this.state = { status: "", percent: "", active: [], id: 0 };
  }

  componentDidMount() {
    let transferId = this.props.match.params.id;
    this.setState({ id: transferId });

    if (parseInt(transferId, 10) !== 0) {
      this.interval = setInterval(() => {
        fetch("/status?transferId=" + transferId)
          .then(response => {
            console.log(response);
            return response.json();
          })
          .then(data => {
            if (data.error) throw data.error;
            this.setState({ status: data.step, percent: data.percent });
            if (parseInt(data.percent, 10) === 100) clearInterval(this.interval);
          })
          .catch(err => {
            console.error(err);
            this.setState({ status: `Error in Transfer`, percent: err });
            clearInterval(this.interval);
          });
      }, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <h3>Job Status</h3>
        <label>Step: {this.state.status}</label> <br />
        <label>Percent Complete: {this.state.percent}</label> <br />
      </div>
    );
  }
}

export default Status;

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
    let header = new Headers({
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Content-Type": "application/json"
    });
    let options = {
      method: "GET",
      mode: "cors",
      headers: header
    };

    fetch("http://localhost:3900/jobs/complete/0..10/asc", options)
      .then(response => {
        return response.json();
      })
      .then(data => {
        let ids = data.map(job => job.id);

        this.setState(state => {
          return { active: this.state.active.concat(ids) };
        });
      });

    if (parseInt(transferId, 10) !== 0) {
      this.interval = setInterval(() => {
        fetch("/status?transferId=" + transferId)
          .then(response => {
            console.log(response);
            //clearInterval(this.interval);
            return response.json();
          })
          .then(data => {
            if (data.error) throw data.error;
            this.setState({ status: data.step, percent: data.percent });
            if (parseInt(data.percent, 10) === 100) clearInterval(this.interval);
          })
          .catch(err => {
            console.error(err);
            alert(err);
            clearInterval(this.interval);
          });
      }, 1000);
    }
  }

  componentDidUpdate() {
    let transferId = this.props.match.params.id;
    if (this.state.id !== parseInt(transferId, 10)) {
      this.setState({ id: transferId });
      if (parseInt(transferId, 10) !== 0) {
        this.interval = setInterval(() => {
          fetch("/status?transferId=" + transferId)
            .then(response => {
              console.log(response);
              //clearInterval(this.interval);
              return response.json();
            })
            .then(data => {
              if (data.error) throw data.error;
              this.setState({ status: data.step, percent: data.percent });
              if (parseInt(data.percent, 10) === 100) clearInterval(this.interval);
            })
            .catch(err => {
              console.error(err);
              alert(err);
              clearInterval(this.interval);
            });
        }, 1000);
      }
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
        <Link to={"/status/0"} replace>
          0
        </Link>
        {this.state.active.map(id => {
          return (
            <Link to={"/status/" + id} replace>
              {id}
            </Link>
          );
        })}
        <label>{JSON.stringify(this.state.active)}</label>
      </div>
    );
  }
}

export default Status;

import React, { Component } from "react";
import Link from "react-router-dom/Link";

class StatusList extends Component {
  constructor(props) {
    super(props);
    this.state = { active: [], jobs: [] };
  }

  componentDidMount() {
    let header = new Headers({
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Content-Type": "application/json"
    });
    let options = {
      method: "GET",
      mode: "cors",
      headers: header
    };
    fetch("http://localhost:3900/jobs/0..100/desc", options)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ jobs: data });
      });
  }

  render() {
    return (
      <div>
        {this.state.jobs.map(job => {
          return (
            <React.Fragment>
              <Link to={"/status/" + job.id} replace>
                {job.id}
              </Link>
              <p>{job.data.title}</p>
              <br />
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}

export default StatusList;

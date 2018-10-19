import React, { Component } from "react";
import http from "http";

class Transfer extends Component {
  constructor(props) {
    super(props);
    this.state = { source: "", dest: "", file: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    //console.log("source: " + this.state.source + "\n" + "dest: " + this.state.dest + "\n" + "file: " + this.state.file);
    var url =
      "/transferfile?source=" +
      this.state.source +
      "&sourceRDN=false&destination=" +
      this.state.dest +
      "&destinationRDN=true&file=" +
      this.state.file;
    http.get(url, function(res) {});
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Source:
          <input type="text" name="source" value={this.state.source} onChange={this.handleChange} />
        </label>
        <br />
        <label>
          Dest:
          <input type="text" name="dest" value={this.state.dest} onChange={this.handleChange} />
        </label>
        <br />
        <label>
          File:
          <input type="text" name="file" value={this.state.file} onChange={this.handleChange} />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default Transfer;

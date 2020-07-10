import React, { Component } from "react";

export default class Application extends Component {
  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:8080/ws");
    this.socket.addEventListener("open", (event) => {
      console.log(event);
    });
    this.socket.addEventListener("message", (event) => {
      console.log(event);
    });
  }

  render() {
    return <div>Application</div>;
  }
}

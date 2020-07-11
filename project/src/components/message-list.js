import React, { Component } from "react";
import axios from "axios";

export default class RoomList extends Component {
  state = {
    messages: [],
  };

  componentDidMount() {
    axios
      .get(`/messages?room=${this.props.room}`)
      .then(({ data: messages }) => this.setState({ messages }));
  }

  render() {
    return (
      <ul>
        {this.state.messages.map((message) => (
          <li>
            {message.username} {message.content}
          </li>
        ))}
      </ul>
    );
  }
}

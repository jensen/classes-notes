import React, { Component } from "react";

export default class MessageList extends Component {
  render() {
    return (
      <ul>
        {this.props.messages.map((message) => (
          <li>
            {message.user} - {message.content}
          </li>
        ))}
      </ul>
    );
  }
}

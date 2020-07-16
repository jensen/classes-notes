import React, { Component } from "react";
import { format } from "date-fns";

export default class MessageList extends Component {
  render() {
    return (
      <ul className="message-list">
        {this.props.messages.map((message) => (
          <li className="message-list__item">
            [{format(new Date(message.time), "HH:mm")}] [{message.user}] -{" "}
            {message.content}
          </li>
        ))}
      </ul>
    );
  }
}

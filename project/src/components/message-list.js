import React, { Component } from "react";
import { format } from "date-fns";

const key = (message) => `${new Date(message.time).getTime()}-${message.user}`;

export default class MessageList extends Component {
  render() {
    const messages = this.props.messages.map((message) => (
      <li key={key(message)} className="message-list__item">
        [{format(new Date(message.time), "HH:mm")}] [{message.user}] -{" "}
        {message.content}
      </li>
    ));

    return <ul className="message-list">{messages}</ul>;
  }
}

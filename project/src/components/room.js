import axios from "axios";
import React, { Component } from "react";
import MessageList from "components/message-list";
import MessageInput from "components/message-input";
import RemoteStore from "debug/remote-store";

import Name from "components/name";

export default class Room extends Component {
  state = {
    messages: [],
  };

  componentDidMount() {
    axios
      .get(`/messages?room=${this.props.room}`)
      .then(({ data: messages }) => this.setState({ messages }));

    this.send({ type: "JOIN_ROOM", room: this.props.room });

    this.props.socket.omessage = (event) => {
      const action = JSON.parse(event);

      console.log(action);
    };
  }

  send(data) {
    this.props.socket.send(JSON.stringify(data));
  }

  sendMessage(message) {
    /* tell remote store to update */
    this.send({
      type: "NEW_MESSAGE",
      message,
    });

    /* update local state */
    this.setState({
      messages: [
        ...this.state.messages,
        {
          user: this.props.name,
          content: message,
        },
      ],
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.room !== this.props.room && this.props.room !== null) {
      axios
        .get(`/messages?room=${this.props.room}`)
        .then(({ data: messages }) => this.setState({ messages }));

      this.send({ type: "JOIN_ROOM", room: this.props.room });
    }
  }

  componentWillUnmount() {
    this.send({ type: "LEAVE_ROOM" });
  }

  render() {
    return (
      <div>
        <MessageList room={this.props.room} messages={this.state.messages} />
        {this.props.name ? (
          <>
            {this.props.name}
            <MessageInput sendMessage={this.sendMessage.bind(this)} />
          </>
        ) : (
          <Name
            value={this.state.value}
            setName={(name) => {
              this.props.setName(name);
              this.send({ type: "SET_NAME", name: name });
            }}
          />
        )}
        <RemoteStore />
      </div>
    );
  }
}

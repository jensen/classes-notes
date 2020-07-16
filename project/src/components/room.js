import axios from "axios";
import React, { Component } from "react";
import MessageList from "components/message-list";
import MessageInput from "components/message-input";

import Name from "components/name";

export default class Room extends Component {
  state = {
    messages: [],
  };

  componentDidMount() {
    this.props.socket.onmessage = (event) => {
      const action = JSON.parse(event.data);

      if (action.type === "NEW_MESSAGE") {
        this.setState({
          messages: [
            ...this.state.messages,
            { content: action.content, user: action.user, time: action.time },
          ],
        });
      }
    };

    axios
      .get(`/messages?room=${this.props.room}`)
      .then(({ data: messages }) => this.setState({ messages }));

    this.send({ type: "JOIN_ROOM", room: this.props.room });
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
          time: new Date(),
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
      <main>
        {this.props.name ? (
          <section>
            <div className="user-name">{this.props.name}</div>
            <div>
              <MessageInput sendMessage={this.sendMessage.bind(this)} />
            </div>
          </section>
        ) : (
          <Name
            value={this.state.value}
            setName={(name) => {
              this.props.setName(name);
              this.send({ type: "SET_NAME", name: name });
            }}
          />
        )}
        <MessageList room={this.props.room} messages={this.state.messages} />
      </main>
    );
  }
}

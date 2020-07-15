import React, { Component } from "react";
import MessageList from "components/message-list";

export default class Room extends Component {
  state = {
    message: "",
  };

  componentDidMount() {
    this.dispatch({ type: "JOIN_ROOM", room: this.props.room });
  }

  compoenntDidUpdate(prevProps) {
    if (prevProps.room !== this.props.room) {
      this.dispatch({ type: "JOIN_ROOM", room: this.props.room });
    }
  }

  componentWillUnmount() {
    this.dispatch({ type: "LEAVE_ROOM", room: this.props.room });
  }

  render() {
    return (
      <div>
        <MessageList room={this.props.id} />
        <MessageInput sendMessage={this.props.sendMessage} />
      </div>
    );
  }
}

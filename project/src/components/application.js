import React, { Component } from "react";
import RoomList from "components/room-list";
import Room from "components/room";
import Name from "components/name";

export default class Application extends Component {
  state = {
    name: "",
    room: null,
  };

  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:8080/ws");
    this.socket.onopen = (event) => {};
    this.socket.omessage = (event) => {
      const action = JSON.parse(event);

      console.log(action);
    };
  }

  componentWillUnmount() {
    this.socket.close();
  }

  dispatch(action) {
    this.socket.send(JSON.stringify(action));
  }

  changeName(name) {
    this.setState({
      name,
    });
    this.dispatch({ type: "CHANGE_NAME", name });
  }

  joinRoom(room) {
    this.setState({
      room,
    });
  }

  sendMessage(message) {
    this.dispatch({ type: "ADD_MESSAGE", message });
  }

  render() {
    return (
      <>
        <Room
          room={this.state.room}
          sendMessage={this.sendMessage.bind(this)}
        />
        <RoomList selectRoom={this.joinRoom.bind(this)} />
      </>
    );
  }
}

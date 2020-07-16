import React, { Component } from "react";
import RoomList from "components/room-list";
import Room from "components/room";

export default class Application extends Component {
  state = {
    name: "",
    room: null,
  };

  componentDidMount() {
    this.socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
  }

  componentWillUnmount() {
    this.socket.close();
  }

  setName(name) {
    this.setState({
      name,
    });
  }

  joinRoom(room) {
    this.setState({
      room,
    });
  }

  render() {
    return (
      <>
        <RoomList
          room={this.state.room}
          selectRoom={this.joinRoom.bind(this)}
        />
        {this.socket && this.state.room && (
          <Room
            room={this.state.room}
            socket={this.socket}
            name={this.state.name}
            setName={this.setName.bind(this)}
          />
        )}
      </>
    );
  }
}

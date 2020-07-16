import React, { Component } from "react";
import axios from "axios";

export default class RoomList extends Component {
  state = {
    rooms: [],
  };

  componentDidMount() {
    axios.get("/rooms").then(({ data: rooms }) => this.setState({ rooms }));
  }

  chooseRoom(room) {
    this.props.selectRoom(room);
  }

  render() {
    const rooms = this.state.rooms.map((room) => (
      <li key={room}>
        <button onClick={() => this.chooseRoom(room)}>{room}</button>
      </li>
    ));

    return (
      <ul>
        {rooms}
        {this.props.room && (
          <button onClick={() => this.chooseRoom(null)}>leave</button>
        )}
      </ul>
    );
  }
}

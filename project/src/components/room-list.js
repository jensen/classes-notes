import React, { Component } from "react";
import axios from "axios";

export default class RoomList extends Component {
  state = {
    rooms: [],
  };

  componentDidMount() {
    axios.get("/rooms").then(({ data: rooms }) => this.setState({ rooms }));
  }

  render() {
    const rooms = this.state.rooms.map((room) => (
      <li>
        <button onClick={() => this.props.selectRoom(room)}>{room}</button>
      </li>
    ));

    return <ul>{rooms}</ul>;
  }
}

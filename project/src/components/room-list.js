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
      <li className="room-list__item" key={room}>
        <button onClick={() => this.chooseRoom(room)}>{room}</button>
      </li>
    ));

    return (
      <ul className="room-list">
        {rooms}
        <li className="room-list__item" key="leave">
          <button
            disabled={this.props.room === null}
            onClick={() => this.chooseRoom(null)}
          >
            leave
          </button>
        </li>
      </ul>
    );
  }
}

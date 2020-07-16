import React, { Component } from "react";

export default class Name extends Component {
  state = {
    name: "",
  };

  render() {
    return (
      <input
        type="text"
        className="text-input"
        value={this.state.name}
        placeholder="Enter Name"
        onChange={(event) =>
          this.setState({
            name: event.target.value,
          })
        }
        onKeyUp={(event) => {
          if (event.key === "Enter") {
            this.props.setName(this.state.name);
          }
        }}
      />
    );
  }
}

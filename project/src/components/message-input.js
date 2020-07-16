import React, { Component } from "react";

export default class MessageInput extends Component {
  state = {
    message: "",
  };

  render() {
    return (
      <input
        type="text"
        value={this.state.message}
        onChange={(event) => this.setState({ message: event.target.value })}
        onKeyUp={(event) => {
          if (event.key === "Enter") {
            this.props.sendMessage(this.state.message);
            this.setState({
              message: "",
            });
          }
        }}
      />
    );
  }
}

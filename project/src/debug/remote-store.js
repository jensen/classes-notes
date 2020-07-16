import React, { Component } from "react";
import axios from "axios";

export default class RemoteStore extends Component {
  state = {
    store: "",
  };

  componentDidMount() {
    this.getStore();
  }

  componentDidUpdate(prevProps, prevState) {
    this.getStore();
  }

  getStore() {
    axios.get(`/store`).then(({ data: store }) => {
      const serialized = JSON.stringify(store, null, 2);

      if (this.state.store !== serialized) {
        this.setState({ store: serialized });
      }
    });
  }

  render() {
    return <pre>{this.state.store}</pre>;
  }
}

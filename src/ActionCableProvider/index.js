import React, { Component, createContext } from "react";
import PropTypes from "prop-types";

import ActionCable from "actioncable";

const { Provider, Consumer } = createContext({});

class ActionCableProvider extends Component {
  constructor(props, context) {
    super(props, context);
    const { cable, url, token } = this.props
    if (cable) {
      this.state = { cable };
    } else {
      const newCable = ActionCable.createConsumer(url, token);
      this.state = { cable: newCable };
    }
  }

  static propTypes = {
    cable: PropTypes.object,
    url: PropTypes.string,
    token: PropTypes.string,
    children: PropTypes.node.isRequired
  }

  componentDidUpdate(prevProps, prevState) {
    const { cable, url, token } = this.props
    if (
      cable === prevProps.cable &&
      url === prevProps.url &&
      token === prevProps.token
    ) {
      return;
    }

    // cable is created by self, disconnect it
    this.state.cable.disconnect();

    // create or assign cable
    if (cable) {
      this.setState({ cable });
    } else {
      const newCable = ActionCable.createConsumer(url, token);
      this.setState({ cable: newCable });
    }
  }

  componentWillUnmount() {
    if (!this.props.cable && this.state.cable) {
      this.state.cable.disconnect();
    }
  }

  render() {
    return (
      <Provider value={this.state.cable}>
        {this.props.children || null}
      </Provider>
    );
  }
}

export { ActionCableProvider, Consumer };

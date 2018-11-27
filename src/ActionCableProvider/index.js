import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import actioncable from "actioncable";

const { Provider, Consumer } = createContext({});

class ActionCableProvider extends Component {
  constructor(props, context) {
    super(props, context);
    if (this.props.cable) {
      this.state = { cable: this.props.cable };
    } else {
      const cable = actioncable.createConsumer(this.props.url);
      this.state = { cable };
    }
  }

  static propTypes = {
    cable: PropTypes.object,
    url: PropTypes.string,
    children: PropTypes.node.isRequired
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.cable === prevProps.cable &&
      this.props.url === prevProps.url
    ) {
      return;
    }

    // cable is created by self, disconnect it
    this.state.cable.disconnect();

    // create or assign cable
    if (this.props.cable) {
      this.setState({ cable: this.props.cable });
    } else {
      const cable = actioncable.createConsumer(this.props.url);
      this.setState({ cable });
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

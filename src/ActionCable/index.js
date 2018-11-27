import React, { PureComponent, cloneElement, Children } from "react";
import PropTypes from "prop-types";

// Import context consumer
import { Consumer } from "../ActionCableProvider";

class ActionCable extends PureComponent {

  static propTypes = {
    onReceived: PropTypes.func,
    onInitialized: PropTypes.func,
    onConnected: PropTypes.func,
    onDisconnected: PropTypes.func,
    onRejected: PropTypes.func,
    children: PropTypes.any,
    cable: PropTypes.object.isRequired,
    channel: PropTypes.string.isRequired,
    room: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }

  state = {
    subscribedChannel: null
  };

  componentDidMount() {
    const {
      onReceived,
      onInitialized,
      onConnected,
      onDisconnected,
      onRejected,
      cable,
      channel,
      room
    } = this.props;
    const subscribedChannel = cable.subscriptions.create(
      { channel, room },
      {
        received: data => {
          onReceived && onReceived(data);
        },
        initialized: () => {
          onInitialized && onInitialized();
        },
        connected: () => {
          onConnected && onConnected();
        },
        disconnected: () => {
          onDisconnected && onDisconnected();
        },
        rejected: () => {
          onRejected && onRejected();
        }
      }
    );
    this.setState({ subscribedChannel });
  }

  componentWillUnmount() {
    if (this.state.subscribedChannel) {
      this.props.cable.subscriptions.remove(this.state.subscribedChannel);
    }
  }

  send = data => {
    if (!this.state.subscribedChannel) {
      throw new Error("ActionCable component unloaded");
    }
    this.state.subscribedChannel.send(data);
  }

  perform = (action, data) => {
    if (!this.state.subscribedChannel) {
      throw new Error("ActionCable component unloaded");
    }
    this.state.subscribedChannel.perform(action, data);
  }

  render() {
    const { children } = this.props;
    const childrenWithProps = Children.map(children, child =>
      cloneElement(child, { perform: this.perform, send: this.send })
    );
    return childrenWithProps || null;
  }
}

export default props => (
	<Consumer>{cable => <ActionCable {...props} cable={cable} />}</Consumer>
);

A react wrapper for working with rails actioncable. Requires react v16.3 and above.

# Install

[![Greenkeeper badge](https://badges.greenkeeper.io/thorion3006/actioncable-client-react.svg)](https://greenkeeper.io/)

`npm i --save actioncable actioncable-client-react`

or

`yarn add actioncable actioncable-client-react`

# Usage

## Subscription

```javascript
import React, { PureComponent } from 'react'
import { ActionCable } from 'actioncable-client-react'

class chatRoom extends PureComponent {
	state = {
		messages = [],
		message
	}

	handleReceived = message => {
		this.setState({
			messages: [
				...this.state.messages,
                message
			]
		})
	}

	sendMessage = () => {
		this.props.send(this.state.message)
	}

	onChange = e => {
		this.setState({message: e.target.value})
	}

	render() {
		return (
			<div>
				<ActionCable
					channel={'ChatRoom'}
					room={1}
					onReceived={this.handleReceived}
				/>
				<h2>Chat Room 1</h2>
				<h5>Messages</h5>
				<ul>
                {this.state.messages.map((message) =>
                    <li key={message.id}>{message.body}</li>
				)}
				</ul>
                <input onChange={this.onChange} type='text' />
				<button onClick={this.sendMessage} type='button'>
					Send
				</button>
			</div>
		)
	}
}

export default chatRoom
```

## Connection

With a url prop:

```javascript
import { ActionCableProvider } from "actioncable-client-react";
import ChatRoom from "./chatRoom";

// With jwt authentication
const WSS_URL = `wss://example.com/cable?${YOUR_TOKEN}`;

// Without authentication
const WSS_URL = `wss://example.com/cable`;

export default function Container(props) {
  return (
    <ActionCableProvider url={WSS_URL}>
      <ChatRoom />
    </ActionCableProvider>
  );
}
```

With a custom cable:

```javascript
import { ActionCableProvider } from "actioncable-client-react";
import { ActionCable } from "actioncable";
import ChatRoom from "./chatRoom";

// With jwt authentication
const WSS_URL = `wss://example.com/cable?${YOUR_TOKEN}`;

// Without authentication
const WSS_URL = `wss://example.com/cable`;

const cable = ActionCable.createConsumer(WSS_URL);

export default function Container(props) {
  return (
    <ActionCableProvider cable={cable}>
      <ChatRoom />
    </ActionCableProvider>
  );
}
```

# Documentation

## ActionCableProvider

It establishes connection between the server and the client and returns a cable object.

It accepts the following props:
Atleast one of them must be present.

- **cable** (object): The object created by rails actioncable's createConsumer method.

- **url** (string): The url of the server with which to establish a connection. Authentication can be passed as a param in the string.

## ActionCable

It creates a subscription with a channel. It needs the ActionCableProvider component to be present somewhere in its parent node.

It accepts the following props:

- **onReceived** (function): Function to handle data received from the server. It should accept one param.
- **onInitialized** (function): This function is invoked after initializing a subscription.
- **onConnected** (function): This function is invoked after the subscription is successfully connected to a channel.
- **onDisconnected** (function): This function is invoked after a subscription is disconnected.
- **onRejected** (function): This function is invoked when a connection is rejected.
- **channel** (string): The class name of the rails channel to subscribe to. **Required**
- **room** (string, number): The room in a channel to subscribe to, must be present if there are mutiple rooms in a channel.

It adds the following props to its child components:

- **perform** (function, params: (action, data)): This function requires two params - the action to be performed on the channel and the data for it.
- **send** (function, params: (data)): This function requires one param - the data to be sent to the server.

# To-Do

- Write tests
- Add examples
- Create a template for opening issues

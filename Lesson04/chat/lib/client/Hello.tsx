import * as React from "react";
import * as ReactDOM from "react-dom";

interface Props {
	name: string;
}

interface State {
	count: number;
}

export default class Hello extends React.Component<Props, State> {
	state = {
		count: 0
	}

	increment() {
		this.setState({
			count: this.state.count + 1
		});
	}

	render() {
		return <div>
			<h1>Hello { this.props.name } { this.state.count } </h1>
				<button onClick = {() => this.increment()
					}> Increment </button>
		</div>
  }
}

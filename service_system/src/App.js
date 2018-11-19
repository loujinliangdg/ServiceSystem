import React, {
	Component
} from 'react';
// import { Switch,Route } from 'react-router-dom';
import './App.css';
const qs = require('querystring')





class App extends Component {
	constructor() {
		super();
	}
	componentWillMount(){
		let query = qs.parse(this.props.location.search.replace(/^\?&*/,''));
		if (query.code) {
			this.props.history.replace(`/autoLogin?code=${query.code}`)
		}
		// 登陆变啦
		else {
			this.props.history.replace(`/login`)
		}
	}
	render() {
		return <div > </div>
	}
}

export default App;
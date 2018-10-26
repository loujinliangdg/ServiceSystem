import React, {Component} from 'react';


class Loading extends Component {
	render() {
		return <div style={{fontSize:'14px',color:'#424242',lineHeight:'2'}}>{this.props.content || '数据努力加载中...'}</div>
	}
}

export default Loading;
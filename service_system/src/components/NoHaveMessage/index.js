import React, {Component} from 'react';




class NoHaveMessage extends Component {
	render() {
		return <div style={{fontSize:'14px',color:'#424242',lineHeight:'2'}}>{this.props.content || '暂无数据'}</div>
	}
}

export default NoHaveMessage;
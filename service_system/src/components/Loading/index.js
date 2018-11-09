import React, {Component} from 'react';

import loading_png from '../../assets/img/loading.svg';

class Loading extends Component {
	render() {
		return (
			<div style={{fontSize:'14px',color:'#424242',lineHeight:'2',textAlign:'center'}}>
				{this.props.content || '数据努力加载中...'}
				{/* <br/>
				<img style={{width:'30px'}} src={loading_png} alt="loading"/> */}
			</div>
		)
	}
}

export default Loading;
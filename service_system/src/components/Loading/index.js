import React, {PureComponent} from 'react';

import loading_png from '../../assets/img/loading.svg';

class Loading extends PureComponent {
	render() {
		return (
			<div style={{fontSize:'14px',color:'#424242',lineHeight:'2',textAlign:'center'}}>
				{this.props.content || '数据努力加载中...'}
			</div>
		)
	}
}

export default Loading;
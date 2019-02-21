import React, {PureComponent} from 'react';

class Mask extends PureComponent {
	render() {
		return (
			<div style={{position:'fixed',left:0,top:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.3)',zIndex:'9999'}} onClick={this.props.onClick}>
                {this.props.children}
			</div>
		)
	}
}

export default Mask;
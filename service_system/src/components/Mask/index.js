import React, {PureComponent} from 'react';

class Mask extends PureComponent {
	static defaultProps = {
		onClick:function(){}
	}
	pageTouchMove(event){
        if(event.cancelable){
			event.preventDefault();
		}
    }
	render() {
		return (
			<div className="Mask" style={{position:'fixed',left:0,top:0,width:'100%',height:'100%',background:'rgba(0,0,0,0.3)',zIndex:'9999'}} onTouchMove={this.pageTouchMove.bind(this)} onClick={this.props.onClick}>
                {this.props.children}
			</div>
		)
	}
}

export default Mask;
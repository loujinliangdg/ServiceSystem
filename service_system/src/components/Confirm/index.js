
import React,{Component} from 'react'
import Mask from '../Mask'
import './assets/css/index.css'
class Confirm extends Component{
    pageTouchMove(event){
        if(event.cancelable){
            event.preventDefault();
        }
    }
    render(){
        var btns = [
            this.props.Confirm.success,
            this.props.Confirm.cancel
        ]
        // 倒序 左边取消 右边确定
        if(this.props.Confirm.btns_order === 'desc') btns = btns.reverse();
        return (
            <div className="Confirm" onTouchMove={this.pageTouchMove.bind(this)}>
                <div className="confirm">
                    <div className="title">{this.props.Confirm.title}</div>
                    <div className="content" style={{textAlign:this.props.Confirm.align}}>
                        {this.props.Confirm.content}
                    </div>
                    <div className="buttons flex text-center" style={{borderTop:'1px solid rgba(159,159,159,.2)',lineHeight:'2.5'}}>
                        {btns.map((item) => <a key={item.text} style={item.style} href="javascript:void(0)" className="flex1" onClick={item.callback}>{item.text}</a>)}
                    </div>
                </div>
            </div>
        )
    }
}


export default (props) =>{
    const defaultProps = {
        mask:true,
        title:'提示',
        content:'想干点什么呢',
        align:'left',
        btns_order:'asc', //倒序desc
        success:{
            text:'确定',
            style:{},
            callback:function(){}
        },
        cancel:{
            text:'取消',
            style:{},
            callback:function(){}
        }
    }
    if(typeof props.Confirm === 'object'){
        for(let key in props.Confirm){
            if(key === 'success' || key === 'cancel'){
                if(typeof props.Confirm[key] === 'string') {
                    defaultProps[key].text = props.Confirm[key];
                    continue;
                }
                if(typeof props.Confirm[key] === 'function') {
                    defaultProps[key].callback = props.Confirm[key];
                    continue;
                }
                if(typeof props.Confirm[key] === 'object'){
                    let c_success_or_cancel = props.Confirm[key];
                    let d_success_or_cancel = defaultProps[key];
                    for(let key in c_success_or_cancel){
                        d_success_or_cancel[key] = c_success_or_cancel[key];
                    }
                    continue;
                }
            }
            else if(key == 'mask'){
                defaultProps[key] = !!props.Confirm[key]
            }
            else{
                defaultProps[key] = props.Confirm[key]
            }
        }
    }
    return (
        defaultProps.mask ?
        <Mask>
            <Confirm Confirm={defaultProps}></Confirm>
        </Mask>
        : <Confirm Confirm={defaultProps}></Confirm>
    )
}
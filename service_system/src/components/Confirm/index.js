
import React,{Component} from 'react'

class Confirm extends Component{
    constructor(){
        super();
        this.state = {
            Confirm:{
                style:{
                    position:'fixed',
                    left:0,
                    bottom:0,
                    right:0,
                    top:0,
                    zIndex:1000,
                    background:'rgba(0,0,0,0.04)'
                }
            },
            confirm:{
                style:{
                    width:'75%',
                    border:'1px solid rgba(159,159,159,.2)',
                    borderRadius:'5px',
                    background:'#fff',
                    position:'absolute',
                    left:'50%',
                    top:'50%',
                    webKitTransform:'translate(-50%,-50%)',
                    transform:'translate(-50%,-50%)'
                }
            },
            title:{
                style:{
                    textAlign:'center',
                    lineHeight:2.4,
                    borderBottom:'1px solid rgba(159,159,159,.2)',
                }
            },
            content:{
                style:{
                    padding:'20px',
                    lineHeight:1.5,
                }
            }
        }
    }
    componentDidMount(){
    }
    pageTouchMove(event){
        event.preventDefault();
    }
    render(){
        return (
            <div className="Confirm" style={this.props.Confirm_is_show ? this.state.Confirm.style : {display:'none'}} onTouchMove={this.pageTouchMove.bind(this)}>
                <div className="confirm" style={this.state.confirm.style}>
                    <div className="title" style={this.state.title.style}>提示</div>
                    <div className="content" style={this.state.content.style}>
                        {this.props.Confirm.content || '您想干什么呢？'}
                    </div>
                    <div className="buttons flex text-center" style={{borderTop:'1px solid rgba(159,159,159,.2)',lineHeight:'2.5'}}>
                        <a className="flex1" onClick={this.props.Confirm.success || function(){console.log('您点击了确定按钮')}}>确定</a>
                        <a className="flex1" onClick={this.props.Confirm.cancel || function(){console.log('您点击了取消按钮')}} style={{borderLeft:'1px solid rgba(159,159,159,.2)'}}>取消</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default Confirm
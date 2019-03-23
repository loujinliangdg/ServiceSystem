import React,{Component} from 'react'
import req from '@/assets/js/req'
import './assets/css/index.css'
import DocumentTitle from '@/components/DocumentTitle'
const Util = require('@/components/Util')

const qs = require('querystring')
class AddChildAccount extends Component{
    constructor(){
        super();
        this.state = {
            loginName:'',
            password:'',
        }
        this.bianlaId = window.localStorage.getItem('bianlaId');
        this.deviceArray = JSON.parse(window.localStorage.getItem('deviceArray'));
        this.deviceId = this.deviceArray[0].deviceId;
        this.deviceNo = this.deviceArray[0].deviceNo;
    }

    onSubmit(event){
        if(event.cancelable){
            event.preventDefault();
        }
        this.addAchildAction();
    }
    loginNameChange(event){
        this.setState({loginName:event.target.value})
    }
    passwordChange(event){
        this.setState({password:event.target.value})
    }
    addAchildAction(){
        req.post('机主新增打印账号',qs.stringify({loginName:this.state.loginName,password:this.state.password,deviceId:this.deviceId}),(result) =>{
            Util.Toast(result.alertMsg);
            if(result.code == 1){
                this.props.history.go(-1);
            }
        },(error) =>{
            Util.Toast(error.toString());
        })
    }
    render(){
        return (
            <div className="App AddChildAccount">
                <DocumentTitle title="添加子账号"></DocumentTitle>
                <h5>添加子账号</h5>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <div className="formItem">
                        <div className="inner">
                            <label htmlFor="" className="flex align-items-center">
                                <span>账号：</span>
                                <input className="flex1" value={this.state.loginName} type="text" placeholder="请输入账号" onChange={this.loginNameChange.bind(this)} />
                            </label>
                        </div>
                    </div>
                    <div className="formItem">
                        <div className="inner">
                            <label htmlFor="" className="flex align-items-center">
                                <span>密码：</span>
                                <input className="flex1" value={this.state.password} type="password" placeholder="请输入密码" onChange={this.passwordChange.bind(this)} />
                            </label>
                        </div>
                    </div>
                    <div className="formItem">
                        <div className="submit"><button>添加</button></div>
                    </div>
                </form>
            </div>
        )
    }
}

export default AddChildAccount
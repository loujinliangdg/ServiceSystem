import React,{Component} from 'react'
import req from '@/assets/js/req'
import {LocalComponent} from '@/HightComponent'
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
        var partern = /[^\w]/;
        var name = '';
        if(partern.test(this.state.loginName)){
            name = '账号';
        }
        else if(partern.test(this.state.password)){
            name = '密码';
        }
        if(name){
            Util.Toast(`${name}中不能包含特殊字符`,1800);
            return ;
        }

        req.post('机主新增打印账号',qs.stringify({loginName:this.state.loginName,password:this.state.password,deviceId:this.props.deviceId}),(result) =>{
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
                            <em className="input-prompt">20个以内字符，仅可使用字母、数字或下划线</em>
                        </div>
                    </div>
                    <div className="formItem">
                        <div className="inner">
                            <label htmlFor="" className="flex align-items-center">
                                <span>密码：</span>
                                <input className="flex1" value={this.state.password} type="password" placeholder="请输入密码" onChange={this.passwordChange.bind(this)} />
                            </label>
                            <em className="input-prompt">20个以内字符，仅可使用字母、数字或下划线</em>
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

export default LocalComponent(AddChildAccount)
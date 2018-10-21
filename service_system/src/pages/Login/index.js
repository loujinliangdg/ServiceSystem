import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import './assets/css/index.css'

import logo_png from './assets/img/logo.png'
import shouji_png from './assets/img/shouji.png'
import shuo_png from './assets/img/shuo.png'

import req from '../../assets/js/req'
const qs = require('querystring')

class Login extends Component {
    constructor(){
        super();
        this.state = {
            bianlaId:'',
            password:''
        }
    }
    login(){
        req.post('登陆变啦',qs.stringify({phoneNumber:this.state.bianlaId,password:this.state.password}),(result) =>{
            console.log(result)
        },(error) =>{
            console.log(error.toString())
        })
    }
    // 账号输入回调
    inputBianlaIdHandle(event){
        var target = event.target;
        this.setState({bianlaId:target.value})
    }
    // 密码输入回调
    inputPasswordHandle(event){
        var target = event.target;
        this.setState({password:target.value})
    }
    render() {
        return (
            <div className="App login-app">
                <div className="logo"><img src={logo_png} alt="" /></div>
                <div className="login-bianla-form">
                    <div className="form-group flex align-items-center">
                        <label htmlFor="userName"><img className="shouji" src={shouji_png} alt="" /></label>
                        <input className="flex1" id="userName" type="tel" value={this.state.bianlaId} placeholder="请输入您的变啦账号" onChange={this.inputBianlaIdHandle.bind(this)} />
                    </div>
                    <div className="form-group flex align-items-center">
                        <label htmlFor="password"><img className="shuo" src={shuo_png} alt="" /></label>
                        <input className="flex1" id="password" type="password" value={this.state.password} placeholder="请输入您的密码" onChange={this.inputPasswordHandle.bind(this)} />
                    </div>
                    <Link className="forget-password" to="/forgetPassword">忘记密码?</Link>
                    <p className="error-ts"></p>
                    <button className="login" onClick={this.login.bind(this)}>登陆</button>
                </div>
                <p className="tishi">提示：请使用变啦账号登录</p>
            </div>
        );
    }
}
  
export default Login;
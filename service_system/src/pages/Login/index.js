import React, { Component } from 'react';
import './assets/css/index.css'

import logo_png from './assets/img/logo.png'
import shouji_png from './assets/img/shouji.png'
import shuo_png from './assets/img/shuo.png'

class Login extends Component {
    constructor(){
        super();
        
    }
    login(){

    }
    render() {
        return (
            <div className="App login-app">
                <div className="logo"><img src={logo_png} alt="" /></div>
                <div className="login-bianla-form">
                    <div className="form-group">
                        <img className="shouji" src={shouji_png} alt="" /><input type="tel" v-model="bianlaId" placeholder="请输入您的变啦账号" />
                    </div>
                    <div className="form-group">
                        <img className="shuo" src={shuo_png} alt="" /><input type="password" v-model="bianlaPas" placeholder="请输入您的密码" />
                    </div>
                    {/* <router-link className="forget-password" to="/forgetPassword">忘记密码?</router-link> */}
                    <p className="error-ts"></p>
                    <button className="login" >登陆</button>
                </div>
                <p className="tishi">提示：请使用变啦账号登录</p>
            </div>
        );
    }
}
  
export default Login;
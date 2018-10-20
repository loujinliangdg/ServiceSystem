import React, { Component } from 'react';

class AutoLogin extends Component {
    constructor(){
        super();
    }
    login(){

    }
    render() {
        return (
            <div className="App">
            自动登陆
                {/* <div className="logo"><img src="../assets/img/logo.png" alt="" /></div>
                <div className="login-bianla-form">
                    <div className="form-group">
                        <img className="shouji" src="../assets/img/shouji.png" alt="" /><input type="tel" maxlength="11"  v-model="bianlaId" placeholder="请输入您的变啦账号" />
                    </div>
                    <div className="form-group">
                        <img className="shuo" src="../assets/img/shuo.png" alt="" /><input type="password" v-model="bianlaPas" placeholder="请输入您的密码" />
                    </div>
                    <router-link className="forget-password" to="/forgetPassword">忘记密码?</router-link>
                    <p className="error-ts"></p>
                    <button className="login" >登陆</button>
                </div>
                <p className="tishi">提示：请使用变啦账号登录</p> */}
            </div>
        );
    }
}
  
export default AutoLogin;
import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import './assets/css/index.css'
import DocumentTitle from '../../components/DocumentTitle'
import logo_png from './assets/img/logo.png'
import shouji_png from './assets/img/shouji.png'
import shuo_png from './assets/img/shuo.png'

import req from '../../assets/js/req'
const qs = require('querystring')

class Login extends Component {
    constructor(){
        super();
        this.state = {
            bianlaId:'',    //账号
            password:'',    //密码
            errorTs:'', //错误提示
            resquesting:false,  //请求请求中
            disabled:'disabled',    //是否可点击 '' || disabled
        }
    }
    componentWillMount(){
        
    }
    login(){
        // 如果请求中 或者 不能提交状态 则直接返回
        if(this.state.resquesting || this.state.disabled) return;
        // 设为请求中 并设为不可提交状态
        this.setState({requesting:true,disabled:'disabled'});
        
        let query = qs.parse(this.props.location.search.replace(/^\?&*/,''));
        
        let params = {
            phoneNumber:this.state.bianlaId,
            password:this.state.password
        }

        if(query.unionid){
            params.unionid = query.unionid
        }
        if(query.openid){
            params.openid = query.openid
        }

        req.post('登陆变啦',qs.stringify(params),(result) =>{
            this.setState({requesting:false,disabled:''});
            if(result.code === 1){
                this.setState({errorTs:''})
                localStorage.setItem('deviceArray',JSON.stringify(result.data.deviceArray));
                localStorage.setItem('deviceId',result.data.deviceArray[0].deviceId);
                localStorage.setItem('deviceNo',result.data.deviceArray[0].deviceNo);
                localStorage.setItem('bianlaId',result.data.bianlaId);
                localStorage.setItem('phoneNumber',this.state.bianlaId);
                localStorage.setItem('isRead',result.data.isRead);
                //登陆成功 去首页
                var login_after_redirect_uri = sessionStorage.getItem('login_after_redirect_uri');
                this.props.history.replace(login_after_redirect_uri ? login_after_redirect_uri : '/index');
            }
            //否则当前页面显示由后台返回的提示信息
            else{
                this.setState({errorTs:result.alertMsg})
            }
        },(error) =>{
            // TODO:如果出现错误，需要一个提醒 还没想好怎么弄
            this.setState({requesting:false,disabled:''});
        })
    }
    // 账号输入回调
    inputBianlaIdHandle(event){
        var target = event.target;
        if(!this.state.resquesting){
            // 账号11位并且输了密码
            if(target.value.length === 11 && this.state.password){
                this.disabled = '';
                this.setState({disabled:''})
            }
            else{
                this.setState({disabled:'disabled'})
            }
        }
        this.setState({bianlaId:target.value})
    }
    // 密码输入回调
    inputPasswordHandle(event){
        var target = event.target;
        if(!this.state.resquesting){
            // 密码有值，并且帐号是11位
            if(target.value && this.state.bianlaId.length === 11){
                this.setState({disabled:''})
            }
            else{
                this.setState({disabled:'disabled'})
            }
        }
        this.setState({password:target.value})
    }
    render() {
        return (
            <div className="App login-app">
                <DocumentTitle title="登陆"></DocumentTitle>
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
                    <Link className="forget-password-link" to="/login/forgetPassword">忘记密码?</Link>
                    <p className="error-ts">{this.state.errorTs}</p>
                    <button className={this.state.disabled + ' ' + 'login'} onClick={this.login.bind(this)}>登陆</button>
                </div>
                <p className="tishi">提示：请使用变啦账号登录</p>
            </div>
        );
    }
}
  
export default Login;
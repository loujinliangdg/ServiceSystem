import React, { Component } from 'react';

import './assets/css/index.css'

import appIcon_png from './assets/img/small-logo1@2x.png'
import bigImg_png1 from './assets/img/885669375374701228@2x.png'
import bigImg_png2 from './assets/img/542234628146414032@2x.png'


class ForgetPassword extends Component{
    render(){
        return (
            <div className="App forget-password">
                <p className="p-26">如果您忘记了变啦登录密码，可以去变啦APP上设置新的密码，操作方法如下，设置完成就可以用新密码进行登录了!</p>
                <h1>步骤1：</h1>
                <p className="p-28"><span className="open-bianla">打开变啦APP</span><img className="app-icon" src={appIcon_png} /></p>
                <h1>步骤2：</h1>
                <p className="p-28">进入变啦APP登录页（登录状态下退出登录即可回到登录页）点击忘记密码</p>
                <div className="big-child">
                    <img className="big-img" src={bigImg_png1} alt="" />
                </div>
                <h1>步骤3：</h1>
                <p className="p-28">按照找回密码步骤操作，设置新密码，完成后就可以用新密码进行登录了！</p>
                <div className="big-child">
                    <img className="big-img" src={bigImg_png2} alt="" />
                </div>
            </div>
        )
    }
}

export default ForgetPassword
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter,Route,Switch } from 'react-router-dom';
import './index.css';

import * as serviceWorker from './serviceWorker';

import App from './App';
import Login from './pages/Login'
import ForgetPassword from './pages/ForgetPassword'
import AutoLogin from './pages/AutoLogin'
import Index from './pages/Index'
import ChildType from './pages/Index/Main/ChildType'
import ArticleList from './pages/Index/Main/ChildType/ArticleList'
import Article from './pages/Index/Main/ChildType/ArticleList/Article'

import DeviceManagementHome from './pages/Index/Main/DeviceManagementHome'
import DeviceManagement from './pages/Index/Main/DeviceManagementHome/DeviceManagement'
import MemberManagement from './pages/Index/Main/DeviceManagementHome/MemberManagement'
import MyDevice from './pages/Index/Main/DeviceManagementHome/MyDevice'



ReactDOM.render(
<HashRouter>
    <Switch>
        <Route path="/" exact={true} component={App} chineseName="入口"></Route>
        <Route path="/login" exact={true} component={Login} chineseName="登陆变啦"></Route>
        <Route path="/login/forgetPassword" component={ForgetPassword} chineseName="忘记密码"></Route>
        <Route path="/autoLogin" component={AutoLogin} chineseName="自动登陆"></Route>
        
        <Route path="/index" exact={true} component={Index} chineseName="首页"></Route>
        <Route path="/index/childType" exact={true}  component={ChildType} chineseName="文章子分类"></Route>
        <Route path="/index/childType/articleList" exact={true}  component={ArticleList} chineseName="文章列表"></Route>
        <Route path="/index/childType/articleList/article" exact={true}  component={Article} chineseName="文章"></Route>
        <Route path="/index/deviceManagementHome" exact={true}  component={DeviceManagementHome} chineseName="设备管理主页"></Route>
        <Route path="/index/deviceManagementHome/deviceManagement" exact={true}  component={DeviceManagement} chineseName="设备管理"></Route>
        <Route path="/index/deviceManagementHome/memberManagement" exact={true}  component={MemberManagement} chineseName="成员管理"></Route>
        <Route path="/index/deviceManagementHome/myDevice" exact={true}  component={MyDevice} chineseName="我的设备"></Route>
    </Switch>
</HashRouter> , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

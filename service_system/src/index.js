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
import DoMember from './pages/Index/Main/DeviceManagementHome/MemberManagement/DoMember'
import MyDevice from './pages/Index/Main/DeviceManagementHome/MyDevice'
import SwitchDevice from './pages/Index/Main/DeviceManagementHome/DeviceManagement/SwitchDevice'
import SwitchBodyFatScale from './pages/Index/Main/DeviceManagementHome/DeviceManagement/SwitchBodyFatScale'
import SwitchMode from './pages/Index/Main/DeviceManagementHome/DeviceManagement/SwitchMode'
import SwitchUseScenarios from './pages/Index/Main/DeviceManagementHome/DeviceManagement/SwitchUseScenarios'

import DataSearch from './pages/Index/Main/DataSearch'
import PlayerNumber from './pages/Index/Main/DataSearch/PlayerNumber'
import WechatAddNumber from './pages/Index/Main/DataSearch/WechatAddNumber'

ReactDOM.render(
<HashRouter>
    <Switch>
        <Route path="/" exact={true} component={App} chineseName="入口"></Route>
        <Route path="/login" exact={true} component={Login} chineseName="登陆变啦"></Route>
        <Route path="/login/forgetPassword" component={ForgetPassword} chineseName="忘记密码"></Route>
        <Route path="/autoLogin" component={AutoLogin} exact={true} chineseName="自动登陆"></Route>
        
        <Route path="/index" exact={true} component={Index} chineseName="首页"></Route>
        <Route path="/index/dataSearch" exact={true}  component={DataSearch} chineseName="数据查询"></Route>
        <Route path="/index/dataSearch/playerNumber" exact={true}  component={PlayerNumber} chineseName="上秤人数"></Route>
        <Route path="/index/dataSearch/wechatAddNumber" exact={true}  component={WechatAddNumber} chineseName="新增粉丝人数"></Route>

        <Route path="/index/childType" exact={true}  component={ChildType} chineseName="文章子分类"></Route>
        <Route path="/index/childType/articleList" exact={true}  component={ArticleList} chineseName="文章列表"></Route>
        <Route path="/index/childType/articleList/article" exact={true}  component={Article} chineseName="文章"></Route>
        <Route path="/index/deviceManagementHome" exact={true}  component={DeviceManagementHome} chineseName="设备管理主页"></Route>
        <Route path="/index/deviceManagementHome/deviceManagement" exact={true}  component={DeviceManagement} chineseName="设备管理"></Route>
        <Route path="/index/deviceManagementHome/deviceManagement/switchDevice" exact={true}  component={SwitchDevice} chineseName="切换设备"></Route>
        <Route path="/index/deviceManagementHome/deviceManagement/switchBodyFatScale/:bodyFatScaleList"  component={SwitchBodyFatScale} chineseName="切换体脂秤"></Route>
        <Route path="/index/deviceManagementHome/deviceManagement/switchMode/:currentMode"  component={SwitchMode} chineseName="切换模式"></Route>
        <Route path="/index/deviceManagementHome/deviceManagement/switchUseScenarios"  component={SwitchUseScenarios} chineseName="切换使用场景"></Route>

        <Route path="/index/deviceManagementHome/memberManagement" exact={true}  component={MemberManagement} chineseName="成员管理"></Route>
        <Route path="/index/deviceManagementHome/memberManagement/doMember"  component={DoMember} chineseName="添加成员"></Route>
        <Route path="/index/deviceManagementHome/myDevice" exact={true}  component={MyDevice} chineseName="我的设备"></Route>
    </Switch>
</HashRouter> , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

import React, { Component } from 'react';
import { Route,Switch } from 'react-router-dom';
import './assets/css/index.css'
import DocumentTitle from '@/components/DocumentTitle'
import Banner from './Banner'
import Main from './Main'
import Question from './Question'
import DataSearch from './Main/DataSearch'
import ChildType from './Main/ChildType'
import DeviceManagementHome from './Main/DeviceManagementHome'

class Index extends Component{
    render(){
        return (
            <div className="App index">
                <DocumentTitle title="首页"></DocumentTitle>
                <Banner></Banner>
                <Main></Main>
                <Question postType="cjwt"></Question>
            </div>
        )
    }
}

const IndexRoute = () =>{
    return (
        <Switch>
            <Route path="/index" exact component={Index} chineseName="首页"></Route>
            <Route path="/index/dataSearch" component={DataSearch} chineseName="数据查询"></Route>
            <Route path="/index/childType" component={ChildType} chineseName="文章子分类"></Route>
            <Route path="/index/deviceManagementHome" component={DeviceManagementHome} chineseName="设备管理主页"></Route>
        </Switch>
    )
}

export default IndexRoute
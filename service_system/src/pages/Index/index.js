import React, { Component } from 'react';
import './assets/css/index.css'
import DocumentTitle from '../../components/DocumentTitle'
import Banner from './Banner'
import Main from './Main'
import Question from './Question'

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

export default Index
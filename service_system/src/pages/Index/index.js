import React, { Component } from 'react';
import './assets/css/index.css'

import Banner from './Banner'
import Main from './Main'
import Question from './Question'

class Index extends Component{

    render(){
        return (
            <div className="App index">
                <Banner></Banner>
                <Main></Main>
                <Question postType="cjwt"></Question>
            </div>
        )
    }
}

export default Index
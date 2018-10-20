import React, { Component } from 'react';
import { Switch,Route } from 'react-router-dom';
import './App.css';
const qs = require('querystring')





class App extends Component {
  constructor(props){
    super(props);
    let search = window.location.search;
    let code = null;
    if(search){
      code = (qs.parse(search.replace(/^\?&*/,''))).code
    }
    console.log(this.props)
    // 如果有code去自动登陆
    if(code){
      this.props.history.replace(`/autoLogin?code=${code}`)
    }
    // 登陆变啦
    else{
      this.props.history.replace(`/login`)
    }
  }
}

export default App;

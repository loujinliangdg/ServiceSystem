import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter,Route,Switch } from 'react-router-dom';
import './index.css';

import * as serviceWorker from './serviceWorker';

import App from './App';
import Login from './pages/Login'
import AutoLogin from './pages/AutoLogin'


ReactDOM.render(
<HashRouter>
    <Switch>
        <Route path="/" exact={true} component={App}></Route>
        <Route path="/login" component={Login}></Route>
        <Route path="/autoLogin" component={AutoLogin}></Route>
    </Switch>
</HashRouter> , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

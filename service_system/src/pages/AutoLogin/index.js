import React, { Component } from 'react';
import req from '../../assets/js/req'
import DocumentTitle from '../../components/DocumentTitle'

const qs = require('querystring')

class AutoLogin extends Component {
    constructor(){
        super();
        this.timer = null;
        this.autoLoginIndex = 0;
        this.autoLoginTexts = [
            '自动登陆中',
            '自动登陆中.',
            '自动登陆中..',
            '自动登陆中...'
        ]

        this.state = {
            autoLoginText:this.autoLoginTexts[0],
        }
    }
    login(){
        var query = qs.parse(this.props.location.search.replace(/^\?&*/,''))

        req.get('自动登陆',{code:query.code},(result) =>{
            clearInterval(this.timer);
            this.setState({autoLoginText:result.alertMsg})
            if(result.code === 1){
                localStorage.setItem('deviceArray',JSON.stringify(result.data.deviceArray));
                localStorage.setItem('deviceId',result.data.deviceArray[0].deviceId);
                localStorage.setItem('deviceNo',result.data.deviceArray[0].deviceNo);
                localStorage.setItem('bianlaId',result.data.bianlaId);
                localStorage.setItem('isRead',result.data.isRead);
                this.props.history.replace('/index');
            }
            // 仅code=4时去登变啦
            if(result.code === 4){
                this.props.history.replace(`/login?unionid=${result.data.unionid}&openid=${result.data.openid}`)
            }
        },(error) =>{
            clearInterval(this.timer);
            this.setState({autoLoginText:error.toString()})
        })
    }
    componentDidMount(){
        this.timer = setInterval(() =>{
            if(this.autoLoginIndex !== this.autoLoginTexts.length - 1){
                this.autoLoginIndex = this.autoLoginIndex + 1;
            }
            else{
                this.autoLoginIndex = 0;
            }
            this.setState({autoLoginText:this.autoLoginTexts[this.autoLoginIndex]})
        },600)

        // 自动登陆
        this.login();
    }
    render() {
        return (
            <div className="App">
                <DocumentTitle title="自动登陆"></DocumentTitle>
                <p style={{textAlign:'center'}}>{this.state.autoLoginText}</p>
            </div>
        );
    }
}
  
export default AutoLogin;
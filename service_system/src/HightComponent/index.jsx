import React ,{Component} from 'react'
import authorize_url from '@/assets/js/authorize_url'
/**
 * 
 * @param {Component} C
 * @returns {Component} Component 
 */
const LocalComponent = (C) =>{
    class NewComponent extends Component {
        componentWillMount(){
            this.deviceArray = JSON.parse(window.localStorage.getItem('deviceArray'));
            this.deviceId = this.deviceArray[0].deviceId;
            this.deviceNo = this.deviceArray[0].deviceNo;
            this.bianlaId = window.localStorage.getItem('bianlaId');

            // 如果本地没有变啦id则代表没登录，并且现在处于路由的Component
            if(!this.bianlaId && this.props.history){
                this.localURL = window.location.href;
                this.wxAuthorize = authorize_url(`${this.localURL.split('#')[0]}#/autoLogin?`);
                window.location.href = this.wxAuthorize;
            }
        }
        render(){
            return <C 
                {...this.props} 
                deviceArray={this.deviceArray}
                deviceId={this.deviceId}
                deviceNo={this.deviceNo}
                bianlaId={this.bianlaId}
            />
        }
    }
    return NewComponent
}
export {LocalComponent}
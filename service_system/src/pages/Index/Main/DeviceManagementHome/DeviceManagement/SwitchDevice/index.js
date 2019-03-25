import React,{Component} from 'react'
import {LocalComponent} from '@/HightComponent'
import DocumentTitle from '@/components/DocumentTitle'
import './assets/css/index.css'

class SwitchDevice extends Component {
    constructor(){
        super();
        this.state = {
            requested:false,
            deviceArray:JSON.parse(window.localStorage.getItem('deviceArray')) || []
        }
    }
    switchDevice(index){
        if(index == 0) return;
        if(this.state.deviceArray.length <= 1) return;
        // 排序，排用户点的那个设备放在最前面
        this.state.deviceArray.unshift(this.state.deviceArray.splice(index,1)[0]);
        // 更新数据
        this.setState({
            deviceArray:this.state.deviceArray,
        })
        // 更新本地数据
        localStorage.setItem('deviceArray',JSON.stringify(this.state.deviceArray));
        // 返回
        window.history.go(-1);
    }
    render(){
        return (
            <div className="App SwitchDevice">
                <DocumentTitle title="切换设备"></DocumentTitle>
                <div className="switchDevice-container">
                    <h5 className="current-device">当前设备：</h5>
                    <div className="row-block">
                        <div className="row">
                            <div className="flex align-items-center">
                                <div className="flex1">
                                    设备号：<span>{this.state.deviceArray[0].deviceNo}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h5 className="other-device">其它设备：</h5>
                    <div className="row-block">
                        {
                            this.state.deviceArray.map((item,index) =>{
                                return (
                                    <div className="row" onClick={this.switchDevice.bind(this,index)} key={item.deviceNo}>
                                        <div className="flex align-items-center">
                                            <div className="flex1">
                                                设备号：<span>{item.deviceNo}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default LocalComponent(SwitchDevice)
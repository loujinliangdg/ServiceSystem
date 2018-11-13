import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import DocumentTitle from '../../../../../components/DocumentTitle'
import './assets/css/index.css'
import req from '../../../../../assets/js/req'
import Loading from '../../../../../components/Loading'
import you_jian_tou_png from '../../../../Index/Question/assets/img/you_jian_tou_2x.png';

class DeviceManagement extends Component {
    constructor(props){
        super();
        this.state = {
            data:{bodyFatScaleList:[]},
            requested:false,
        }
        this.bianlaId = window.localStorage.getItem('bianlaId');
        this.deviceArray = JSON.parse(window.localStorage.getItem('deviceArray'));
        this.deviceId = this.deviceArray[0].deviceId;
        this.deviceNo = this.deviceArray[0].deviceNo;
    }
    componentDidMount() {
        this.getDeviceData();
    }
    /**
     * 获取设备信息
     */
    getDeviceData(){
        req.get('获取设备的信息',{bianlaId:this.bianlaId,deviceId:this.deviceId},(result) =>{
            if(result.code === 1){
                var data = result.data || {bodyFatScaleList:[]}
                this.setState({
                    data,
                    requested:true,
                })
            }
            else{
                this.setState({
                    requested:true,
                })
            }
        },(error) =>{
            this.setState({
                requested:true,
            })
        })
    }
    // 开始时间选择
    startTimeChange(event){
        this.state.data.beginTime = event.target.value;
        this.setState({
            data:this.state.data
        })
    }
    // 结束时间选择
    endTimeChange(event){
        this.state.data.endTime = event.target.value;
        this.setState({
            data:this.state.data
        }) 
    }
    render(){
        return (
            <div className="App DeviceManagement">
                <DocumentTitle title="设备管理"></DocumentTitle>
                {
                    this.state.requested ? (
                        <div className="deviceManagement-container">
                            <h5 className="current-device">当前设备：</h5>
                            <div className="row-block">
                                <div className="row">
                                    <div className="flex align-items-center">
                                        <div className="flex1">
                                            设备号：<span>{this.deviceNo}</span>
                                        </div>
                                        <div>
                                            <Link className="switch-device-btn" to="/index/deviceManagementHome/deviceManagement/switchDevice">切换</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row-block">
                                <Link className="row" to={`/index/deviceManagementHome/deviceManagement/switchBodyFatScale/${JSON.stringify(this.state.data.bodyFatScaleList)}`}>
                                    <div className="flex align-items-center ">
                                        <div className="flex1">
                                            选择体脂秤
                                        </div>
                                        <div>
                                            <img className="you-jian-tou" src={you_jian_tou_png} alt=""/>
                                        </div>
                                    </div>
                                </Link>
                                <Link className="row" to={`/index/deviceManagementHome/deviceManagement/switchMode/${this.state.data.currentMode}`}>
                                    <div className="flex align-items-center">
                                        <div className="flex1">
                                            选择机器模式
                                        </div>
                                        <div>
                                            <img className="you-jian-tou" src={you_jian_tou_png} alt=""/>
                                        </div>
                                    </div>
                                </Link>
                                <Link className="row" to={`/index/deviceManagementHome/deviceManagement/switchUseScenarios?useScenariosEn=${this.state.data.useScenariosEn}&useScenariosZh=${this.state.data.useScenariosZh}&otherRemark=${this.state.data.otherRemark}`}>
                                    <div className="flex align-items-center" style={{border:'none'}}>
                                        <div className="flex1">
                                            使用场景
                                        </div>
                                        <div>
                                            <img className="you-jian-tou" src={you_jian_tou_png} alt=""/>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="row-block">
                                <div className="row">
                                    <div className="flex align-items-center">
                                        <div className="flex1">
                                            待机时间
                                        </div>
                                        <div>
                                            <span className="start-time">{this.state.data.beginTime}<input type="time" onChange={this.startTimeChange.bind(this)} /></span>至<span className="end-time">{this.state.data.endTime}<input type="time" onChange={this.endTimeChange.bind(this)} /></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : <Loading />                      
                }
            </div>
        )
    }
}

export default DeviceManagement
import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import DocumentTitle from '../../../../../components/DocumentTitle'
import './assets/css/index.css'
import req from '../../../../../assets/js/req'
import Loading from '../../../../../components/Loading'
import Util from '../../../../../components/Util'
import you_jian_tou_png from '../../../../Index/Question/assets/img/you_jian_tou_2x.png';

class DeviceManagement extends Component {
    constructor(){
        super();
        this.state = {
            data:{bodyFatScaleList:[]},
            requested:false,
            timestamp:0,         //设置待机时间 ios专用参数
            resultTimeStamp:0,   //time控件失去蕉点时，离最近一次touchStart的总毫秒数，ios专用参数
        }
        this.bianlaId = window.localStorage.getItem('bianlaId');
        this.deviceArray = JSON.parse(window.localStorage.getItem('deviceArray'));
        this.deviceId = this.deviceArray[0].deviceId;
        this.deviceNo = this.deviceArray[0].deviceNo;
        this.isAndroid = /(Android)/i.test(window.navigator.userAgent);
        this.isIos = /(iPhone|iPad|iPod|iOS)/i.test(window.navigator.userAgent);
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
            Util.Toast(error.toString());
            this.setState({
                requested:true,
            })
        })
    }
    // 设置待机时间接口 time = 12:20  ,  timeName = beginTime || endTime
    setTime(time,timeName){
        var params = {
            beginTime:this.state.data.beginTime,
            endTime:this.state.data.endTime,
            deviceId:this.deviceId,
        }
        // timeName = beginTime || endTime
        params[timeName] = time;
        req.get('设置待机时间',params,(result) =>{
            if(result.code === 1){
                this.state.data[timeName] = time;
                this.setState({data:this.state.data});
            }
            Util.Toast(result.alertMsg);
        },(error) =>{
            Util.Toast(error.toString());
        })
    }
    // 开始时间选择 安卓专用
    beginTimeChange(event){
        if(this.isAndroid){
            var time = event.target.value;
            this.setTime(time,'beginTime');
        }
    }
    // 结束时间选择 安卓专用
    endTimeChange(event){
        if(this.isAndroid){
            var time = event.target.value;
            this.setTime(time,'endTime');
        }
    }
    pageTouchStart(){
        // 时间戳
        this.setState({
            timestamp:Date.now()
        })
    }
    // 开始时间选择 ios专用
    beginTimeBlur(event){
        if(this.isIos){
            var value = event.target.value;
            setTimeout(() =>{
                // 测了iphone 5 iphone 6 iphone 7 iphone 8 iphone x iphonexs max  当没有点完成导至的触发Blur事件，isCancel都不会超过800毫秒 ，系统版本低的 时间会长一点，系统版本高的时间会短一点
                var isCancel = Date.now() - this.state.timestamp < 800;
                // 如果不是取消 则是点了完成
                if(!isCancel){
                    this.setTime(value,'beginTime')
                }
            });
        }
    }
    // 结束时间选择 ios专用
    endTimeBlur(event){
        if(this.isIos){
            var value = event.target.value;
            setTimeout(() =>{
                // 测了iphone 5 iphone 6 iphone 7 iphone 8 iphone x iphonexs max  当没有点完成导至的触发Blur事件，isCancel都不会超过800毫秒 ，系统版本低的 时间会长一点，系统版本高的时间会短一点
                var isCancel = Date.now() - this.state.timestamp < 800;
                // 如果不是取消 则是点了完成
                if(!isCancel){
                    this.setTime(value,'endTime')
                }
            });
        }
    }
    render(){
        return (
            <div className="App DeviceManagement" onTouchStart={this.pageTouchStart.bind(this)}>
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
                                            <span className="begin-time">{this.state.data.beginTime}
                                                <input type="time" onBlur={this.beginTimeBlur.bind(this)} onChange={this.beginTimeChange.bind(this)} />
                                            </span>
                                            至
                                            <span className="end-time">{this.state.data.endTime}
                                                <input type="time" onBlur={this.endTimeBlur.bind(this)} onChange={this.endTimeChange.bind(this)} />
                                            </span>
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
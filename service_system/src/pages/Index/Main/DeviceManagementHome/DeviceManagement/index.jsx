import React,{Component} from 'react'
import {Link,Switch,Route} from 'react-router-dom'
import {LocalComponent} from '@/HightComponent'
import DocumentTitle from '@/components/DocumentTitle'
import SwitchDevice from './SwitchDevice'
import SwitchBodyFatScale from './SwitchBodyFatScale'
import SwitchMode from './SwitchMode'
import SwitchUseScenarios from './SwitchUseScenarios'
import './assets/css/index.css'
import req from '@/assets/js/req'
import Loading from '@/components/Loading'
import Util from '@/components/Util'
import you_jian_tou_png from '../../../../Index/Question/assets/img/you_jian_tou_2x.png';
import authorize_url from '@/assets/js/authorize_url'
import ToSwitchDeviceItem from '@/components/ToSwitchDeviceItem/index'

const ListItem = (props) =>{
    return (
        <Link className="row" to={props.link}>
            <div className="flex align-items-center ">
                <div className="flex1">
                    {props.text}
                </div>
                <div>
                    <img className="you-jian-tou" src={you_jian_tou_png} alt=""/>
                </div>
            </div>
        </Link>
    )
}

class DeviceManagement extends Component {
    constructor(){
        super();
        this.state = {
            data:{bodyFatScaleList:[]},
            requested:false,
            timestamp:0,         //设置待机时间 ios专用参数
            resultTimeStamp:0,   //time控件失去蕉点时，离最近一次touchStart的总毫秒数，ios专用参数
        }
        this.isAndroid = /(Android)/i.test(window.navigator.userAgent);
        this.isIos = /(iPhone|iPad|iPod|iOS)/i.test(window.navigator.userAgent);
    }
    componentWillMount(){
        this.getDeviceData();
    }
    /**
     * 获取设备信息
     */
    getDeviceData(){
        req.get('获取设备的信息',{bianlaId:this.props.bianlaId,deviceId:this.props.deviceId},(result) =>{
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
            deviceId:this.props.deviceId,
        }
        // timeName = beginTime || endTime
        params[timeName] = time;
        req.get('设置待机时间',params,(result) =>{
            if(Math.abs(result.code) === 401){
                sessionStorage.setItem('login_after_redirect_uri',this.localURL.split('#')[1]);
                window.location.href = this.wxAuthorize;
            }
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
                            <ToSwitchDeviceItem deviceNo={this.props.deviceNo}></ToSwitchDeviceItem>
                            <div className="row-block">
                                <ListItem text="选择体脂秤" link={`/index/deviceManagementHome/deviceManagement/switchBodyFatScale/${JSON.stringify(this.state.data.bodyFatScaleList)}`}></ListItem>    
                                <ListItem text="选择机器模式" link={`/index/deviceManagementHome/deviceManagement/switchMode/${this.state.data.currentMode}`}></ListItem>    
                                <ListItem text="使用场景" link={`/index/deviceManagementHome/deviceManagement/switchUseScenarios?useScenariosEn=${this.state.data.useScenariosEn}&useScenariosZh=${this.state.data.useScenariosZh}&otherRemark=${this.state.data.otherRemark}`}></ListItem>    
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

const DeviceManagementRoute = () =>{
    return (
        <Switch>
            <Route path="/index/deviceManagementHome/deviceManagement" exact={true}  component={LocalComponent(DeviceManagement)} chineseName="切换设备"></Route>
            <Route path="/index/deviceManagementHome/deviceManagement/switchDevice" component={SwitchDevice} chineseName="切换设备"></Route>
            <Route path="/index/deviceManagementHome/deviceManagement/switchBodyFatScale/:bodyFatScaleList"  component={SwitchBodyFatScale} chineseName="切换体脂秤"></Route>
            <Route path="/index/deviceManagementHome/deviceManagement/switchMode/:currentMode"  component={SwitchMode} chineseName="切换模式"></Route>
            <Route path="/index/deviceManagementHome/deviceManagement/switchUseScenarios"  component={SwitchUseScenarios} chineseName="切换使用场景"></Route>
        </Switch>
    )
}


export default DeviceManagementRoute
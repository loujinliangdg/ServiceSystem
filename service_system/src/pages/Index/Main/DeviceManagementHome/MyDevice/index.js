import React,{Component} from 'react'
import DocumentTitle from '../../../../../components/DocumentTitle'
import './assets/css/index.css'
import req from '../../../../../assets/js/req'
import Loading from '../../../../../components/Loading'
import Util from '../../../../../components/Util'
import authorize_url from '../../../../../assets/js/authorize_url'

class DeviceManagement extends Component {
    constructor(props){
        super();
        this.state = {
            dataList:[], //分类列表
            requested:false,
        }
        this.bianlaId = window.localStorage.getItem('bianlaId');
        this.wxAuthorize = null;
        this.localURL = window.location.href;
    }
    componentWillMount(){
        this.wxAuthorize = authorize_url(`${this.localURL.split('#')[0]}#/autoLogin?`);
    }
    componentDidMount() {
        if(!this.bianlaId){
            sessionStorage.setItem('login_after_redirect_uri',this.localURL.split('#')[1]);
            window.location.href = this.wxAuthorize;
        }
        else{
            this.getList();
        }
    }
    /**
     * 获取子分类列表
     */
    getList(){
        req.get('设备运行状态',{bianlaId:this.bianlaId},(result) =>{
            if(Math.abs(result.code === 401)){
                sessionStorage.setItem('login_after_redirect_uri',this.localURL.split('#')[1]);
                window.location.href = this.wxAuthorize;
            }
            if(result.code === 1){
                var dataList = result.data.myDeviceList || [];
                this.setState({
                    dataList,
                    requested:true,
                })
            }
            else{
                this.setState({
                    requested:true,
                })
            }
        },(error) =>{
            Util.Toast(error.toString())
            this.setState({
                requested:true,
            })
        })
    }
    // 信号量转百分比
    signalPercent(signal){
        var _signal = isNaN(parseFloat(signal)) ? 0 : parseFloat(signal)
        return _signal * 2 + '%'
    }
    // 信号量的百分比转 异常状态提醒 
    signalPercentToZh(signalPercent){
        var _signalPercent = parseFloat(signalPercent);
        if(_signalPercent === 0){
            return '4G信号无'
        }
        else if(_signalPercent <= 20){
            return '4G信号极弱'
        }
        else if(_signalPercent <= 40){
            return '4G信号弱'
        }
        else{
            return '4G信号正常'
        }
    }
    render(){
        return (
            <div className="App myDevice">
                <DocumentTitle title="我的设备"></DocumentTitle>
                {
                    this.state.requested ? (
                        <ul className="list">
                            {
                                this.state.dataList.map((item,index) =>{
                                    return (
                                        <li className="list-item" key={item.deviceNo}>
                                            <div className="order-number">
                                                <div className="inner">
                                                    <div className="flex align-items-center">
                                                        <div className="flex1">
                                                            设备{index+1}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex align-items-center">
                                                <div className="flex1">设备编号：</div>
                                                <div className="text-right">
                                                    <span className="text">{item.deviceNo}</span>
                                                </div>
                                            </div>
                                            <div className="flex align-items-center">
                                                <div className="flex1">在线状态：</div>
                                                <div className="text-right">
                                                    <span className="text">{item.isOnline ? '在线' : '离线'}</span>
                                                </div>
                                            </div>
                                            <div className="flex align-items-center">
                                                <div className="flex1">信号量</div>
                                                <div className="text-right">
                                                    <span className="text">{this.signalPercent(item.signal)}</span>
                                                </div>
                                            </div>
                                            <div className="flex align-items-center">
                                                <div className="flex1">异常状态提醒</div>
                                                <div className="text-right">
                                                    <span className="text">{this.signalPercentToZh(this.signalPercent(item.signal))}</span>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    ) : <Loading />
                }
                
            </div>
        )
    }
}

export default DeviceManagement
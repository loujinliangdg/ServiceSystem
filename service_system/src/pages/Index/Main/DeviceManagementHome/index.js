import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import DocumentTitle from '../../../../components/DocumentTitle'
import './assets/css/index.css'
import req from '../../../../assets/js/req'
import Loading from '../../../../components/Loading'
import you_jian_tou_png from '../../../Index/Question/assets/img/you_jian_tou_2x.png';
import authorize_url from '../../../../assets/js/authorize_url'

class DeviceManagement extends Component {
    constructor(props){
        super();
        this.state = {
            dataList:[], //分类列表
            requested:false,
            deviceCount:0,
            memberCount:0,
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
        req.get('设备管理首页的信息',{bianlaId:this.bianlaId},(result) =>{
            if(Math.abs(result.code === 401)){
                sessionStorage.setItem('login_after_redirect_uri',this.localURL.split('#')[1]);
                window.location.href = this.wxAuthorize;
            }
            if(result.code === 1){
                var data = result.data || {
                    deviceCount:0,
                    memberCount:0,
                }
                this.setState({
                    deviceCount:data.deviceCount,
                    memberCount:data.memberCount,
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
    render(){
        return (
            <div className="App DeviceManagement">
                <DocumentTitle title="设备管理"></DocumentTitle>
                {
                    this.state.requested ? (
                        <ul className="list">
                            <li className="list-item">
                                <Link className="inner" to={`/index/deviceManagementHome/myDevice`}>
                                    <div className="flex align-items-center">
                                        <div className="flex1">我的设备</div>
                                        <div className="text-right">
                                            <span className="text">{this.state.deviceCount}台</span>
                                            <img className="arrow-right" src={you_jian_tou_png} alt=""/>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                            <li className="list-item">
                                <Link className="inner" to={`/index/deviceManagementHome/deviceManagement`}>
                                    <div className="flex align-items-center">
                                        <div className="flex1">设备管理</div>
                                        <div className="text-right">
                                            <span className="text"></span>
                                            <img className="arrow-right" src={you_jian_tou_png} alt=""/>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                            <li className="list-item">
                                <Link className="inner" to={`/index/deviceManagementHome/memberManagement`}>
                                    <div className="flex align-items-center">
                                        <div className="flex1">成员管理</div>
                                        <div className="text-right">
                                            <span className="text">{this.state.memberCount}人</span>
                                            <img className="arrow-right" src={you_jian_tou_png} alt=""/>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    ) : <Loading />
                }
                
            </div>
        )
    }
}

export default DeviceManagement
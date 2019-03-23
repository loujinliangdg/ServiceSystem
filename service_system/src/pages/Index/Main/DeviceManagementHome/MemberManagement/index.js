import React,{Component} from 'react'
import {Link,Switch,Route} from 'react-router-dom'
import DocumentTitle from '@/components/DocumentTitle'
import Domember from './DoMember'
import './assets/css/index.css'
import req from '@/assets/js/req'
import Loading from '@/components/Loading'
import Confirm from '@/components/Confirm'
import Util from '@/components/Util'
import authorize_url from '@/assets/js/authorize_url'
import SlideLeftDelete from '@/components/SlideLeftDelete'

class MemberManagement extends Component {
    constructor(props){
        super();
        this.state = {
            dataList:[], //分类列表
            requested:false,
            Confirm_is_show:false,
            Confirm:{
                content:'确认删除该成员吗？删除后该成员将不再接到该一体机的推送。',
            }
        }
        this.bianlaId = window.localStorage.getItem('bianlaId');
        this.deviceArray = JSON.parse(window.localStorage.getItem('deviceArray'));
        this.willUser = null;

        this.startX = 0;
        this.startY = 0;

        this.moveX = 0;
        this.moveY = 0;

        this.prevMoveX = null;
        this.prevMoveY = null;

        this.endX = 0;
        this.endY = 0;

        this.userItemTransTime = 600;

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
        // 如果没有设备
        if(!this.deviceArray.length){
            this.setState({
                requested:true,
            })
        }
        else{
            this.deviceArray.forEach((item) =>{
                // req.get('你大爷',{deviceId:item.deviceId})
                this.getList(item.deviceId,item.deviceNo);
            })
        }
        // this.getList();
    }
    /**
     * 获取子分类列表
     */
    getList(deviceId,deviceNo){
        req.get('获取成员列表',{bianlaId:this.bianlaId,deviceId:deviceId},(result) =>{
            if(Math.abs(result.code) === 401){
                sessionStorage.setItem('login_after_redirect_uri',this.localURL.split('#')[1]);
                window.location.href = this.wxAuthorize;
            }
            if(result.code === 1){
                var deviceUserList = result.data.deviceUserList || [];
                var oneDevice = {
                    deviceId:deviceId,
                    deviceNo:deviceNo,
                    deviceUserList:deviceUserList,
                }

                this.state.dataList.push(oneDevice);
                this.setState({
                    dataList:this.state.dataList,
                    requested:true,
                })
                window.localStorage.setItem('memberList',JSON.stringify(this.state.dataList));
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
    allSlideInit(){
        var allSlide = document.querySelectorAll('.was-slide');
        [].slice.call(allSlide).forEach((item) =>{
            item.style.left=0;
        })
    }
    // 点击删除成员
    deleteUser(user){
        // 如果是机主
        if(user.isMain){
            return Util.Toast('机主不可删除')
        }
        // 调起对话框，以确认删除
        this.showConfirm(() =>{
            req.get('删除成员',{deviceId:user.deviceId,phoneNumber:user.phoneNumber,userId:this.bianlaId},(result) =>{
                if(Math.abs(result.code) === 401){
                    sessionStorage.setItem('login_after_redirect_uri',this.localURL.split('#')[1]);
                    window.location.href = this.wxAuthorize;
                }
                if(result.code === 1){
                    // 获取所有设备
                    let dataList = this.state.dataList;

                    // 遍历所有设备
                    for(let i=0; i<dataList.length; i++){

                        let deviceUserList = dataList[i].deviceUserList;
                        // 遍历每台设备中的成员列表
                        for(let j = 0; j<deviceUserList.length; j++ ){
                            let userInList = deviceUserList[j];
                            // 如果当前成员手机号等于要删除的那个成员，则本地删除
                            if(userInList.phoneNumber === user.phoneNumber){
                                deviceUserList.splice(j,1);
                            }
                        }
                    }
                    this.setState({
                        dataList:dataList,
                        Confirm_is_show:false,
                    })
                    this.allSlideInit();
                }
                Util.Toast(result.alertMsg);
            },(error) =>{
                Util.Toast(error.toString());
            })
            // 点击取消时的回调
        },() =>{
            this.setState({
                Confirm_is_show:false,
            })
        })
    }
    // 调起对话框
    showConfirm(successCallback,cancelCallback){
        if(typeof successCallback !== 'function'){throw 'sucessCallback 不是函数'}
        if(typeof cancelCallback !== 'function'){throw 'cancelCallback 不是函数'}
        this.state.Confirm.success = successCallback;
        this.state.Confirm.cancel = cancelCallback;
        this.setState({
            Confirm_is_show:true,
            Confirm:this.state.Confirm
        })
    }
    render(){
        return (
            <div className="App MemberManagement">
                <DocumentTitle title="成员管理"></DocumentTitle>
                {
                    this.state.requested && this.state.dataList.length ? (
                        <div className="memberManagement-container">
                            {
                                this.state.dataList.map((device) =>{
                                    return (
                                        <div className="one-device" key={device.deviceNo}>
                                            <div className="device">
                                                <div className="flex align-items-center">
                                                    <div className="flex1">
                                                        <h5>设备号：（{device.deviceNo}）</h5>
                                                    </div>
                                                    <div>左滑可删除成员</div>
                                                </div>
                                            </div>
                                            <div className="user-list">
                                                {
                                                    device.deviceUserList.map((user) =>{
                                                        // 删除成员时需要知道deviceId 所以从这里获取一下
                                                        user.deviceId = device.deviceId;
                                                        user.deviceNo = device.deviceNo;
                                                        return (
                                                            // 成员
                                                            <div className="user-item" key={user.phoneNumber}>
                                                                <SlideLeftDelete deleteHandle={this.deleteUser.bind(this,user)}>
                                                                    <Link 
                                                                        className="user-item-inner" 
                                                                        to={`/index/deviceManagementHome/memberManagement/doMember?deviceId=${user.deviceId}&deviceNo=${user.deviceNo}&id=${user.id}`}
                                                                        >
                                                                        <div className="flex align-items-center">
                                                                            <div className="flex1">
                                                                                {user.username}（{user.phoneNumber}）{user.isMain ? <span style={{fontSize:'12px',color:'#fff',background:'orange',padding:'1px 4px',borderRadius:'2px'}}>机主</span> : ''}
                                                                            </div>
                                                                            <div className="text-right">
                                                                                {
                                                                                    user.orderTakingSwitch === 1 
                                                                                    ? (<span style={{color:'#40CC45'}}>接单中</span>)
                                                                                    : (<span style={{color:'#C0C0C0'}}>暂停接单</span>)
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                </SlideLeftDelete>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className="bottom">
                                <Link className="enter" to="/index/deviceManagementHome/memberManagement/doMember">添加成员</Link>
                            </div>
                        </div>
                    ) : <Loading />
                }
                {this.state.Confirm_is_show ? <Confirm Confirm={this.state.Confirm} /> : ''}
            </div>
        )
    }
}

const MemberManagementRoute = () =>{
    return (
        <Switch>
            <Route path="/index/deviceManagementHome/memberManagement" exact={true} component={MemberManagement} chineseName="成员管理"></Route>
            <Route path="/index/deviceManagementHome/memberManagement/doMember" component={Domember} chineseName="操作成员"></Route> 
        </Switch>
    )
}

export default MemberManagementRoute
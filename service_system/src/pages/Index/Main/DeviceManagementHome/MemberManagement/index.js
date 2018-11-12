import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import DocumentTitle from '../../../../../components/DocumentTitle'
import './assets/css/index.css'
import req from '../../../../../assets/js/req'
import Loading from '../../../../../components/Loading'
import Confirm from '../../../../../components/Confirm'
import Util from '../../../../../components/Util'
class DeviceManagement extends Component {
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
    }
    componentDidMount() {
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
    pageTouchStart(event){
        if(event.target.className === 'delete-user'){
            return;
        }
        var userItem = [].slice.call(document.querySelectorAll('.user-item-inner'));
        userItem.forEach((item) =>{
            var itemLeft = item.style.left ? parseFloat(item.style.left) : 0;
            if(itemLeft !== 0){
                item.style.webKitTransition = `all ${this.userItemTransTime}ms`;
                item.style.transition = `all ${this.userItemTransTime}ms`;
                item.style.left = 0 + 'px';
            }
        })
    }
    userItemTouchStart(event){
        var target = event.targetTouches[0];
        var currentTarget = event.currentTarget;
        this.startX = target.clientX;
        this.startY = target.clientY;
        currentTarget.style.webKitTransition = `all 0ms`;
        currentTarget.style.transition = `all 0ms`;
    }
    userItemTouchMove(event){
        var target = event.targetTouches[0];
        var currentTarget = event.currentTarget;
        var deleteBtn = currentTarget.querySelector('.delete-user');
        
        this.moveX = target.clientX;
        this.moveY = target.clientY;
        
        // 如果横向比纵向滑动的幅度大，则向应左滑删除的动作，并且阻止纵向滚动条的行为
        if(Math.abs(this.moveX - this.startX) > Math.abs(this.moveY - this.startY)){
            event.preventDefault();
            if(this.prevMoveX === null){
                this.prevMoveX = this.moveX;
                this.prevMoveY = this.moveY;
            }
            else{
                var willX = this.moveX - this.prevMoveX;
                var itemLeft = currentTarget.style.left ? parseFloat(currentTarget.style.left) : 0;
                currentTarget.style.left = ((itemLeft + willX) > 0 ? 0 : (itemLeft + willX) < -deleteBtn.offsetWidth ? -deleteBtn.offsetWidth : (itemLeft + willX)) + 'px';
            }



            this.prevMoveX = this.moveX;
            this.prevMoveY = this.moveY;
        }
    }
    userItemTouchEnd(event){
        var target = event.changedTouches[0];
        var currentTarget = event.currentTarget;
        var deleteBtn = currentTarget.querySelector('.delete-user');
        var itemLeft = currentTarget.style.left ? parseFloat(currentTarget.style.left) : 0;
        var deleteBtnWidth = deleteBtn.offsetWidth
        if(Math.abs(itemLeft) >=  deleteBtnWidth * 0.6){
            let transTime = (deleteBtnWidth - Math.abs(itemLeft)) * (this.userItemTransTime / deleteBtnWidth);
            currentTarget.style.webKitTransition = `all ${transTime}ms`;
            currentTarget.style.transition = `all ${transTime}ms`;
            currentTarget.style.left = -deleteBtnWidth + 'px';
        }
        else{
            let transTime = Math.abs(itemLeft) * (this.userItemTransTime / deleteBtnWidth);
            currentTarget.style.webKitTransition = `all ${transTime}ms`;
            currentTarget.style.transition = `all ${transTime}ms`;
            currentTarget.style.left = 0;
        }
        this.startX = 0;
        this.startY = 0;

        this.moveX = 0;
        this.moveY = 0;
        
        this.prevMoveX = null;
        this.prevMoveY = null;
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
        this.state.Confirm_is_show = true;
        this.setState({
            Confirm_is_show:this.state.Confirm_is_show,
            Confirm:this.state.Confirm
        })
    }
    render(){
        return (
            <div className="App MemberManagement">
                <DocumentTitle title="成员管理"></DocumentTitle>
                {
                    this.state.requested && this.state.dataList.length ? (
                        <div className="memberManagement-container" onTouchStart={this.pageTouchStart.bind(this)}>
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
                                                            <div className="user-item" key={user.phoneNumber}>
                                                                <div className="user-item-inner" 
                                                                    onTouchStart={this.userItemTouchStart.bind(this)} 
                                                                    onTouchMove={this.userItemTouchMove.bind(this)} 
                                                                    onTouchEnd={this.userItemTouchEnd.bind(this)}>
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
                                                                    <button className="delete-user" onClick={this.deleteUser.bind(this,user)}>删除</button>
                                                                </div>
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
                                <Link className="enter" to="javascript:;">添加成员</Link>
                            </div>
                        </div>
                    ) : <Loading />
                }
                <Confirm Confirm_is_show={this.state.Confirm_is_show} Confirm={this.state.Confirm}></Confirm>
            </div>
        )
    }
}

export default DeviceManagement
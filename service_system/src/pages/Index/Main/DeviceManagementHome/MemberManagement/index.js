import React,{Component} from 'react'
import {Link} from 'react-router-dom'

import './assets/css/index.css'
import req from '../../../../../assets/js/req'
import Loading from '../../../../../components/Loading'

class DeviceManagement extends Component {
    constructor(props){
        super();
        this.state = {
            dataList:[], //分类列表
            requested:false,
        }
        this.bianlaId = window.localStorage.getItem('bianlaId');
        this.deviceArray = JSON.parse(window.localStorage.getItem('deviceArray'));

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
    render(){
        return (
            <div className="App MemberManagement" onTouchStart={this.pageTouchStart.bind(this)}>
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
                                                                    <button className="delete-user">删除</button>
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
                            <h1>测试测试</h1>
                            <h1>测试测试</h1>
                            <h1>测试测试</h1>
                            <h1>测试测试</h1>
                            <h1>测试测试</h1>
                            <h1>测试测试</h1>
                            <h1>测试测试</h1>
                            <h1>测试测试</h1>
                            <h1>测试测试</h1>
                            <h1>测试测试</h1>
                            <h1>测试测试</h1>
                            <h1>测试测试</h1>
                            <h1>测试测试</h1>
                            <h1>测试测试</h1>
                        </div>
                    ) : <Loading />
                }
                <div className="bottom">
                    <Link className="enter" to="">添加成员</Link>
                </div>
            </div>
        )
    }
}

export default DeviceManagement
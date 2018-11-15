import React,{Component} from 'react'
import DocumentTitle from '../../../../../../components/DocumentTitle'
import './assets/css/index.css'
import req from '../../../../../../assets/js/req'
import Util from '../../../../../../components/Util'
import default_qrCode_png from './assets/img/default_qrCode.png'
import gantan_png from './assets/img/gantan.png'
import upQiNiu from '../../../../../../assets/js/up_qiniu';

const qs = require('querystring');


const MAX_MEMBER = 12; //最大接单数
/**
 * 
 * @param {Array} deviceUserList 单台设备的成员列表
 * @return {Number} 返回单台设备接单成员总数 
 */
function getOneDeviceOrderTakingCount(deviceUserList){
    var count = 0;
    deviceUserList.forEach((item) =>{
        if(item.orderTakingSwitch){
            count++;
        }
    })
    return count;
}



class OneDevice extends Component{
    constructor(){
        super();
        this.getOneDeviceOrderTakingCount = getOneDeviceOrderTakingCount
    }
    componentDidMount(){
        
    }
    componentDidUpdate(){
        
    }
    checkeDevice(event){
        event.stopPropagation();
        console.log(event.target)
    }
    // 获取一台设备的接单人数
    render(){
        return (
            <div className="flex align-items-center">
                <label 
                    className={this.props.device.isChecked ? 'on' : ''} >
                    <input data-device-no={this.props.device.deviceNo} onClick={this.props.checkeDevice} name="allMode" type="radio" style={{position:'absolute',left:'-100px',zIndex:'-1'}} />
                </label>
                <div className="flex1">
                    <span>{this.props.device.deviceNo}</span>
                    {/* 如果是新增成员，则当前设备接单人数大于等于 */}
                    <div className="warning" style={{display:(this.getOneDeviceOrderTakingCount(this.props.device.deviceUserList) >= MAX_MEMBER) ? 'block' : 'none'}}>
                        <img src={gantan_png} alt=""/>
                        <span>设备接单成员最多为{MAX_MEMBER}人，当前设备以达到上限！</span>
                    </div>
                </div>
                <div 
                    className={`switch ${
                                    (this.props.device.user ? this.props.device.user.orderTakingSwitch : (this.props.device.deviceUserList[this.props.device.deviceUserList.length -1 ].orderTakingSwitch)) == 1 //eslint-disable-line
                                    ? 'on' 
                                    : ''}`
                                }
                    onClick={this.props.switchClick}
                    data-device-no={this.props.device.deviceNo}>
                    <span className="green-circle"></span>
                </div>
            </div>
        )
    }
}


/**
 * 新增成员 或 编辑成员 组件
 */
class DoMember extends Component{
    constructor(){
        super();
        this.memberList = JSON.parse(window.localStorage.getItem('memberList')) || [];
        var add = {
            phoneNumber:'',
            deviceId:'',
            nickName:'',
            orderTakingSwitch:0,
            originQrCode:default_qrCode_png,
        }
        this.state = {
            memberList:this.memberList.map((item) =>{item.isChecked = false;item.deviceUserList.push(JSON.parse(JSON.stringify(add)));return item}),
            device:{deviceUserList:[],user:{}},
            add:add
        }
        this.isAddMember = true;
        this.bianlaId = window.localStorage.getItem('bianlaId');
        console.log(this.state.memberList)
        this.getOneDeviceOrderTakingCount = getOneDeviceOrderTakingCount
    }
    componentWillMount(){
        this.query = qs.parse(this.props.location.search.replace(/^\?&*/,''));
        // 是否是添加成员 添加成员时会给当前页面传参过来 {} 等于没有传参
        this.isAddMember = JSON.stringify(this.query) === '{}' ? true : false;
    }
    componentDidMount(){
        // 编辑成员
        if(!this.isAddMember){
            var device = this.state.memberList.filter((device) => device.deviceId == this.query.deviceId )[0]; //eslint-disable-line
            device.user = device.deviceUserList.filter((item) => item.id == this.query.id)[0]                   //eslint-disable-line
            device.isChecked = true;

            this.setState({
                device:device
            })
        }
    }
    // 手机号变动
    phoneNumberChange(event){
        var value = event.target.value;
        if(value.length == 1 && value != 1){
            value = 1;
        }
        if(value.length > 11){
            value = value.slice(0,11);
        }
        this.setRealValue('phoneNumber',value);
    }
    // 备注变动
    usernameChange(event){
        var value = event.target.value;
        if(value.length > 5){
            value = value.slice(0,5);
        }
        this.setRealValue('userName',value);
    }
    // 接单状态变动
    switchClick(event){
        var target = event.target;
        var currentTarget = event.currentTarget;
        // console.log(currentTarget)
        if(target === currentTarget){
            // 编辑成员时 切换接单状态
            if(!this.isAddMember){
                // 如果编辑成员时，这台设备接单人员已达上限，但此时这个人处于未接单状态 则不能让他开启
                if(this.getOneDeviceOrderTakingCount(this.state.device.deviceUserList) >= MAX_MEMBER && this.state.device.user.orderTakingSwitch == 0){ //eslint-disable-line

                }
                // 不达最大上限，或已达最大上限但进来时是接单状态 则可以改变接单状态，此时不会超出最大接单人数
                else{
                    this.state.device.user.orderTakingSwitch = Number(!parseInt(this.state.device.user.orderTakingSwitch)) //eslint-disable-line
                    this.setState({
                        device:this.state.device
                    })
                }
            }
            else{
                let checkeDeviceNo = event.currentTarget.getAttribute('data-device-no');

                this.setState({
                    memberList:this.state.memberList.map((item) =>{
                        var deviceUserList = item.deviceUserList;       //这台设备的成员列表，包含将要添加的这个人
                        var willAddMember = deviceUserList[deviceUserList.length - 1]   //将要添加的这个人
                        if(item.deviceNo == checkeDeviceNo){ //eslint-disable-line
                            // 此台设备接单人数
                            var orderTakingCount = this.getOneDeviceOrderTakingCount(item.deviceUserList);
                            var isNotChecked = !item.isChecked;
                            // 是否未选中该设备
                            var isNotChecked = !item.isChecked;
                            if(isNotChecked){
                                Util.Toast('开启接单前请先选中该设备',900)
                            }
                            // 如果编辑成员时，这台设备接单人员已达上限，但此时这个人处于未接单状态 则不能让他开启
                            else if(this.getOneDeviceOrderTakingCount(deviceUserList) >= MAX_MEMBER && willAddMember.orderTakingSwitch == 0) { //eslint-disable-line
                                Util.Toast('该设备接单人数已达上限',900)
                            }
                            else{
                                willAddMember.orderTakingSwitch = Number(!parseInt(willAddMember.orderTakingSwitch));
                                // 同步到 新增成员 预提交的参数对象中
                                this.state.add.switcherStatus = willAddMember.orderTakingSwitch;
                            }
                        }
                        else{
                            // item.switcherStatus = 0;
                        }
                        return item;
                    })
                })
            }
        }
    }
    // 设备选择变动 只有添加成员时才有这个事件
    checkeDevice(event){
        var checkeDeviceNo = event.currentTarget.getAttribute('data-device-no');

        if(checkeDeviceNo){
            this.setState({
                memberList:this.state.memberList.map((item) =>{
                    var deviceUserList = item.deviceUserList;       //这台设备的成员列表，包含将要添加的这个人
                    var willAddMember = deviceUserList[deviceUserList.length - 1]   //将要添加的这个人
                    // 当前选中的设备
                    if(item.deviceNo == checkeDeviceNo){//eslint-disable-line
                        item.isChecked = true;
                        
                        // 如果选中当前设备，当前设备接单成员数没有达到最大接单量
                        if(this.getOneDeviceOrderTakingCount(item.deviceUserList) < MAX_MEMBER){
                            // 自动开始接单
                            willAddMember.orderTakingSwitch = 1;

                            console.log(item.deviceUserList)
                            // console.log(item)
                        }
                        else{
                            // 否则不自动开始接单
                            // item.orderTakingSwitch = 0;
                            willAddMember.orderTakingSwitch = 0;
                        }
                        // 同步到 新增成员 预提交的参数对象中
                        this.state.add.switcherStatus = willAddMember.orderTakingSwitch;
                    }
                    // 其它设备
                    else{
                        item.isChecked = false;
                        willAddMember.orderTakingSwitch = 0;
                        // item.orderTakingSwitch = 0;
                    }
                    return item;
                })
            })
        }
    }
    // 设置 新增/编辑对应的值
    setRealValue(name,value){
        if(!this.isAddMember){
            switch (name) {
                case 'phoneNumber':
                    this.state.device.user.phoneNumber = value;
                    break;
                case 'userName':
                    this.state.device.user.username = value;
                    break;
                case 'originQrCode':
                    this.state.device.user.originQrCode = value;
                    break;
                case 'orderTakingSwitch':
                    this.state.device.user.orderTakingSwitch = value;
                    break;
                default:
                    break;
            }
            this.setState({
                device:this.state.device
            })
        }
        else{
            switch (name) {
                case 'phoneNumber':
                    this.state.add.phoneNumber = value;
                    break;
                case 'userName':
                    this.state.add.nickName = value;
                    break;
                case 'originQrCode':
                    this.state.add.originQrCode = value;
                    break;
                case 'orderTakingSwitch':
                    this.state.add.switcherStatus = value;
                    break;
                default:
                    break;
            }
            this.setState({
                add:this.state.add
            })
        }
    }
    // 获取 新增/编辑对应的值
    getRealValue(name){
        if(!this.isAddMember){
            switch (name) {
                case 'phoneNumber':
                    return this.state.device.user.phoneNumber
                case 'userName':
                    return this.state.device.user.username;
                case 'originQrCode':
                    return this.state.device.user.originQrCode;
                case 'orderTakingSwitch':
                    return this.state.device.user.orderTakingSwitch;
                default:
                    break;
            }
        }
        else{
            switch (name) {
                case 'phoneNumber':
                    return this.state.add.phoneNumber;
                case 'userName':
                    return this.state.add.nickName;
                case 'originQrCode':
                    return this.state.add.originQrCode;
                case 'orderTakingSwitch':
                    return this.state.add.switcherStatus;
                default:
                    break;
            }
        }
    }
    // 提交
    enter(){
        var api_name = null;
        var params = null;
        // 更新成员
        if(!this.isAddMember){
            console.log(this.state.device);
            params = {
                orderTakingSwitch:this.state.device.user.orderTakingSwitch,
                originQrCode:this.state.device.user.originQrCode === default_qrCode_png ? null : this.state.device.user.originQrCode,
                id:this.state.device.user.id
            }
            api_name = '更新成员';
        }
        // 新增成员
        else{
            console.log(this.state.add);
            console.log(this.state.memberList);
            params = {
                nickName:this.state.add.nickName,
                phoneNumber:this.state.add.phoneNumber,
                switcherStatus:this.state.add.switcherStatus,
                userId:this.bianlaId,
                originQrCode:this.state.add.originQrCode === default_qrCode_png ? null : this.state.add.originQrCode
            }
            // 获取选中的设备id
            this.memberList.forEach((device) =>{
                if(device.isChecked){
                    params.deviceId = device.deviceId;
                }
            })

            if(params.phoneNumber.length < 1){
                Util.Toast('请输入手机号码',900);
                return;
            }
            else if(params.phoneNumber.length < 11){
                Util.Toast('请输入完整的手机号码',900);
                return;
            } else if(!params.deviceId){
                Util.Toast('请绑定设备号',900);
                return;
            }
            api_name = '新增成员';
        }
        if(api_name && params){
            req.get(api_name,params,(result) =>{
                if(result.code === 1){
                    Util.Toast(result.alertMsg,() =>{
                        this.props.history.go(-1)
                    })
                }
                else{
                    Util.Toast(result.alertMsg)
                }
            },(error) =>{
                Util.Toast(error.toString())
            })
        }
    }
    originClick(){
        this.refs.fileInput.dispatchEvent(new MouseEvent('click'));
    }
    fileChange(event){
        let _self = this;
        let file = event.target.files[0];
        if(!file) return;
        // 限制文件格式
        if('image/png|image/jpeg'.indexOf(file.type) === -1){
            event.target.value = '';
            return ;
        }
        upQiNiu(file,{
            complete(res,CompletedResourceAddress){
                // TODO:上传完需要清空value,但是在react里这么清不行，回头看下
                // event.target.value = '';
                // 添加成员
                if(_self.isAddMember){
                    _self.state.add.originQrCode = CompletedResourceAddress;
                    _self.setState({
                        add:_self.state.add
                    })
                }
                // 编辑成员
                else{
                    _self.state.device.user.originQrCode = CompletedResourceAddress;
                    _self.setState({
                        device:_self.state.device
                    })
                }          
            }
        })
    }
    render(){
        return (
            <div className="App DoMember">
                <DocumentTitle title={this.isAddMember ? '添加成员' : '编辑成员'}></DocumentTitle>
                <div className="block">
                    <div className="flex align-items-center">
                        <div className="label">手机号：</div>
                        <div className="flex1">
                            <input className="phoneNumber" onChange={this.phoneNumberChange.bind(this)} type="tel" placeholder="请输入手机号码" value={this.getRealValue('phoneNumber')} disabled={this.isAddMember ? false : true}/>
                        </div>
                    </div>
                    <div className="flex align-items-center">
                        <div className="label">备注：</div>
                        <div className="flex1">
                            <input className="username" onChange={this.usernameChange.bind(this)} type="text" placeholder="备注姓名信息(最长5位)" value={this.getRealValue('userName')} disabled={this.isAddMember ? false : true} />
                        </div>
                    </div>
                </div>
                <div className="block-title">
                    <div className="flex align-items-center">
                        <div className="flex1">设备号</div>
                        <div className="flex1 text-right">接单开关</div>
                    </div>
                </div>
                <div className="block device-list">
                    {  
                        !this.isAddMember 
                        ? (<OneDevice isAddMember={this.isAddMember} switchClick={this.switchClick.bind(this)} device={this.state.device}/>) 
                        : this.state.memberList.map((item) => (
                            <OneDevice isAddMember={this.isAddMember} checkeDevice={this.checkeDevice.bind(this)} switchClick={this.switchClick.bind(this)} key={item.deviceId} device={item} />
                        ))
                    }
                </div>
                <div className="block upload-qrCode">
                    <p>提交该成员微信二维码</p>
                    <div className="qrCode" onClick={this.originClick.bind(this)}>
                        <img src={this.getRealValue('originQrCode')} alt=""/>
                        <input ref="fileInput" accept="image/*" onChange={this.fileChange.bind(this)} style={{position:'absolute',left:0,top:0,right:0,bottom:0,visibility:'hidden'}} type="file" />
                    </div>
                    <p className="text-center">展会模式下不提交二维码，将接不到推送订单</p>
                    <button onClick={this.enter.bind(this)}>提交</button>
                </div>
            </div>
        )
    }
}

export default DoMember
import React,{Component,PureComponent} from 'react';
import {Switch,Route,Link} from 'react-router-dom';
import DocumentTitle from '../../../../../components/DocumentTitle'
import ToSwitchDeviceItem from '../../../../../components/ToSwitchDeviceItem'
import './assets/css/index.css'
import SlideLeftDelete from '../../../../../components/SlideLeftDelete'
import Mask from '../../../../../components/Mask'
import Confirm from '../../../../../components/Confirm'
import req from '../../../../../assets/js/req'
import Loading from '../../../../../components/Loading'
import NotHaveMessage from '../../../../../components/NoHaveMessage'
import AddChildAccount from './AddChildAccount/index'
const Util = require('../../../../../components/Util')
const qs = require('querystring')

/**
 * 修改密码的弹框组件
 */
class EditPassword extends Component{
    static defaultProps = {
        closeEditPassword:function(){},
        accountItem:{},
    }

    constructor(){
        super();
        this.state = {
            password:'',
        }
    }

    sureEditPassword(event){
        var partern = /[^\w]/;
        if(partern.test(this.state.password)){
            Util.Toast(`密码中不能包含特殊字符`,1800);
            return ;
        }
        req.post('机主修改打印账号密码',qs.stringify({id:this.props.accountItem.id,password:this.state.password}),(result) =>{
            if(result.code == 1){
                this.props.closeEditPassword();
            }
            Util.Toast(result.alertMsg);
        },(error) =>{
            Util.Toast(error.toString())
        })
    }
    passwordChange(event){
        this.setState({password:event.target.value});
    }
    render(){
        return (
            <div className="EditPassword">
                <div className="ps-head">
                    <h5 className="text-center">修改密码</h5>
                    <i className="iconfont icon-close" onClick={this.props.closeEditPassword}></i>
                </div>
                <div className="ps-body">
                    <input className="new-password" value={this.state.password} type="password" placeholder="请输入新密码" onChange={this.passwordChange.bind(this)} />
                </div>
                <div className="ps-footer">
                    <button className="yes" onClick={this.sureEditPassword.bind(this)}>修改</button>
                </div>
            </div>
        )
    }
}


class PrintAccountNumber extends Component {
    constructor(){
        super();
        this.state = {
            Confirm_is_show:false,          //删除弹框是否显示
            edit_password_is_show:false,    //修改密码弹框是否显示
            accountList:[],                 //账号列表
            isRequested:false,
            willDeleteItem:{},              //准备删除的那条账号
            willEditPasswordItem:{},        //准备修改密码的那条账号
        }
        this.bianlaId = window.localStorage.getItem('bianlaId');
        this.deviceArray = JSON.parse(window.localStorage.getItem('deviceArray'));
        this.deviceId = this.deviceArray[0].deviceId;
        this.deviceNo = this.deviceArray[0].deviceNo;
    }
    componentWillMount(){
        this.gerPrintAccountList();
    }
    gerPrintAccountList(){
        req.get('获取打印报告系统账号列表',{deviceId:this.deviceId},(result) =>{
            if(result.code == 1){
                this.setState({
                    accountList:result.data.aioWaterSystemUserList || [],
                    isRequested:true,
                })
            }
            else{
                this.setState({
                    isRequested:true,
                })
            }
        },(error) =>{
            this.setState({
                isRequested:true,
            })
        })
    }
    deleteHandle(item,event){
        this.setState({Confirm_is_show:true,willDeleteItem:item});
    }
    editPasswordHandle(item,event){
        this.setState({edit_password_is_show:true,willEditPasswordItem:item})
    }
    allSlideInit(){
        var allSlide = document.querySelectorAll('.was-slide');
        [].slice.call(allSlide).forEach((item) =>{
            item.style.left=0;
        })
    }
    sureDelete(id){
        req.get('机主删除打印账号',{id:id},(result) =>{
            if(result.code == 1){
                this.setState({
                    accountList:this.state.accountList.filter((item) => item.id != id)
                })
                this.allSlideInit();
            }
            else{
                Util.Toast(result.alertMsg);
            }
            this.setState({Confirm_is_show:false})
        },(error) =>{
            Util.Toast(error.toString());
            this.setState({Confirm_is_show:false})
        })
    }
    // 添加子账号
    addChildAccountClick(){
        this.props.history.push('/index/deviceManagementHome/printAccountNumber/addChildAccount')
    }
    // Mask 被点击
    MaskOnClick(event){
        if(/Mask/.test(event.target.className)){
            this.closeEditPassword();
        }
    }
    closeEditPassword(){
        this.setState({edit_password_is_show:false})
    }
    render(){
        return (
            <div className="App PrintAccountNumber">
                <DocumentTitle title="报告系统账号管理"></DocumentTitle>   
                <ToSwitchDeviceItem deviceNo={this.deviceNo}></ToSwitchDeviceItem>
                {/* 删除确认框 */}
                {this.state.Confirm_is_show ? 
                    <Confirm Confirm={
                        {
                            title:'删除提醒',
                            content:`确定删除${this.state.willDeleteItem.loginName}账号？`,
                            align:'center',
                            success:{
                                text:'删除',
                                callback:() =>{
                                    this.sureDelete(this.state.willDeleteItem.id);
                                }
                            },
                            cancel:() =>{
                                this.setState({Confirm_is_show:false})
                            }
                        }
                    } 
                    ></Confirm> : ''
                }
                {
                    this.state.edit_password_is_show ?
                    <Mask onClick={this.MaskOnClick.bind(this)}>
                        <EditPassword closeEditPassword={this.closeEditPassword.bind(this)} accountItem={this.state.willEditPasswordItem}></EditPassword>
                    </Mask> : ''
                }

                <h5 className="account-title">登录账号管理</h5>
                {
                    !this.state.isRequested ?
                    <Loading></Loading> :
                    (
                        this.state.accountList.length ?
                        this.state.accountList.map((item,index) =>{
                            return (
                                <div className="row" key={index}>
                                    <SlideLeftDelete deleteHandle={this.deleteHandle.bind(this,item)}>
                                        <div className="flex align-items-center">
                                            <div>{item.accountType === 1 ? '管理员账号' : '子账号'}{index+1}</div>
                                            <div className="flex1 text-center">{item.loginName}</div>
                                            <div className="edit-password-box"><button className="edit-password" onClick={this.editPasswordHandle.bind(this,item)}>修改密码</button></div>
                                        </div>
                                    </SlideLeftDelete>
                                </div>
                            )
                        }) : <NotHaveMessage></NotHaveMessage>
                    )
                }
                {
                    // 有账号列表，则显示添加子账号按钮
                    this.state.accountList.length ?
                    <div className="add-child-account" onClick={this.addChildAccountClick.bind(this)}>
                        <button>
                            <i className="iconfont icon-plus" style={{marginLeft:'10px'}}></i><span>添加子账号</span>
                        </button>
                    </div> :
                    ''
                }
            </div>
        )
    }
}

const PrintAccountNumberRoute = ()=>{
    return (
        <Switch>
            <Route path="/index/deviceManagementHome/printAccountNumber" exact component={PrintAccountNumber} chineseName="打印报告流水账号管理"></Route>
            <Route path="/index/deviceManagementHome/printAccountNumber/addChildAccount" component={AddChildAccount} chineseName="添加子账号"></Route>
        </Switch>
    )
}

export default PrintAccountNumberRoute

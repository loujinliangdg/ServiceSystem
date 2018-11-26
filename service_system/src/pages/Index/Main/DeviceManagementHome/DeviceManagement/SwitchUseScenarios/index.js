import React,{Component} from 'react'
import DocumentTitle from '../../../../../../components/DocumentTitle'
import './assets/css/index.css'
import req from '../../../../../../assets/js/req'
import Utils from '../../../../../../components/Util'
import Loading from '../../../../../../components/Loading'
import NoHaveMessage from '../../../../../../components/NoHaveMessage'
import authorize_url from '../../../../../../assets/js/authorize_url'

const qs = require('querystring');

class SwitchUseScenarios extends Component {
    constructor(props){
        super();
        this.state = {
            requested:false,
            dataList:[],
            useScenariosEn:null,
            useScenariosZh:null,
            otherRemark:null,
        }
        this.deviceArray = JSON.parse(window.localStorage.getItem('deviceArray'));
        this.bianlaId = window.localStorage.getItem('bianlaId');
        this.deviceId = this.deviceArray[0].deviceId;
        
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
        else {
            var query = qs.parse(this.props.location.search.replace(/^\?&*/,''));
            this.setState({
                useScenariosEn:query.useScenariosEn, //获取当前应用的模式id
                useScenariosZh:query.useScenariosZh, //获取当前应用的模式id
                otherRemark: query.useScenariosEn === 'other' ? query.otherRemark : '', //如果是其它，则接收otherRemark否则置空
            })
            this.getAllUseScenarios();
        }
    }
    getAllUseScenarios(){
        req.get('获取所有的使用场景',{},(result) =>{
            var dataList = [];
            if(Math.abs(result.code) === 401){
                sessionStorage.setItem('login_after_redirect_uri',this.localURL.split('#')[1]);
                window.location.href = this.wxAuthorize;
            }
            if(result.code === 1){
                dataList = result.data.dictionaryItemsList || [];
            }
            this.setState({
                dataList:dataList,
                requested:true,
            })
        },(error) =>{
            this.setState({
                requested:true,
            })
        })
    }
    // 显示当前
    showCurrentUseScenarios(){
        var useScenariosEn = null;
        var useScenariosZh = null;
        // 无默认使用场景
        if(!this.state.useScenariosEn){
            return (
                <div className="flex align-items-center">
                    <div className="flex1 text-center">
                        <span style={{color:'#fff'}}>无</span>
                    </div>
                </div>
            )
        }
        // 有默认使用场景
        else{
            this.state.dataList.forEach((item) =>{
                if(item.itemName === this.state.useScenariosEn){
                    useScenariosEn = item.itemName;
                    useScenariosZh = item.itemValue;
                }
            })

            if(useScenariosEn){
                return (
                    <div className="flex align-items-center">
                        <div className="flex1">
                            <span>{useScenariosZh}</span>
                        </div>
                        <label className="on"><input name="xxx" type="radio" /></label>
                    </div>
                )
            }
        }
    }
    // 确认选择
    enterSwitchUseScenarios(){
        var params = {
            deviceId:this.deviceId,
            useScenariosEn:this.state.useScenariosEn,
        }
        // 如果是其它 则传入otherRemark
        if(params.useScenariosEn === 'other'){
            params.otherRemark = this.state.otherRemark;
            // 如果是其它，但没有输入任何内容则提示它
            if(!params.otherRemark){
                Utils.Toast('请选择使用场景后再提交');
                return;
            }
        }

        req.get('切换使用场景',params,(result) =>{
            result.code === 1 ? Utils.Toast(result.alertMsg,() =>{
                window.history.go(-1);
            }) : Utils.Toast(result.alertMsg);
        },(error) =>{
            Utils.Toast(error.toString());
        })
    }
    computedRenderContent(requested,dataList){
        // 未请求完成
        if(!requested){
            return <Loading />
        }
        // 请求完成无数据
        else if(requested && !dataList.length){
            return <NoHaveMessage />
        }
        // 有数据
        else{
            return (
                <div className="switchUseScenarios-container">
                    <h5 className="current-device">当前场景：</h5>
                    <div className="row-block">
                        <div className="row">
                            {
                                this.showCurrentUseScenarios()
                            }
                        </div>
                    </div>
                    <h5 className="other-device">其它场景：</h5>
                    <div className="row-block flex1">
                        {
                            dataList.map((item,index) =>{
                                if(item.itemName === 'other'){
                                    return ;
                                }
                                else{
                                    return (
                                        <div className="row" onClick={this.switchUseScenarios.bind(this,item)} key={item.id}>
                                            <div className="flex align-items-center">
                                                <div className="flex1">
                                                    <span>{item.itemValue}</span>
                                                </div>
                                                <label className={item.itemName === this.state.useScenariosEn ? 'on' : ''}><input name="allMode" type="radio" /></label>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                    <h5 className="other-device">其它场景：</h5>
                    <div className="row-block">
                        <div className="row">
                            <div className="flex align-items-center">
                                <div className="flex1">
                                    <input type="text" placeholder="输入使用场景" style={{width:'100%',border:'0',fontSize:'15px'}} onChange={this.otherUseScenariosChange.bind(this)} value={this.state.otherRemark}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="enter" onClick={this.enterSwitchUseScenarios.bind(this)}>提交</button>
                </div>
            )
        }
    }
    // 选择
    switchUseScenarios(item){
        this.setState({
            useScenariosEn:item.itemName,
            useScenariosZh:item.itemValue,
            otherRemark:'',
        });
    }
    // 输入
    otherUseScenariosChange(event){
        var value = event.target.value;
        
        this.setState({
            useScenariosEn:'other',
            useScenariosZh:'',
            otherRemark:value
        });
        console.log(this.state)
        console.log(value)
    }
    render(){
        return (
            <div className="App SwitchUseScenarios">
                <DocumentTitle title="切换使用场景"></DocumentTitle>
                {this.computedRenderContent(this.state.requested,this.state.dataList)}
            </div>
        )
    }
}

export default SwitchUseScenarios
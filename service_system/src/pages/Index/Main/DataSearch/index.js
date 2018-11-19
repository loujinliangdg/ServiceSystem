import React ,{Component} from 'react'
import {Link} from 'react-router-dom'
import DocumentTitle from '../../../../components/DocumentTitle'

import './assets/css/index.css'
import you_jian_tou from './assets/img/you-jian-tou02.png'
import req from '../../../../assets/js/req'
import Util from '../../../../components/Util'
import { Line,XAxis,CartesianGrid,LineChart,YAxis } from 'recharts';
import Loading from '../../../../components/Loading'
import NoHaveMessage from '../../../../components/NoHaveMessage'
import you_jian_tou_png from '../../Question/assets/img/you_jian_tou_2x.png'
import authorize_url from '../../../../assets/js/authorize_url'

// recharts 中有用到recharts，但是像iso 8.3不支持，所以在这写个Polyfill
Number.isFinite = Number.isFinite || function(value) {
    return typeof value === "number" && isFinite(value);
}

function addDate(date, days) {
    if (days == undefined || days == '') {
        days = 0;
    }
    var date = new Date(date);
    date.setDate(date.getDate() + days);
    return getDateString(date);
}
// 将Date对象转换成2018-08-08字符串形式
function getDateString(date){
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);
}
// 2018-08-08 to 2018/08/08
function dateStringToPageShow(dateString){
    return /-/.test(dateString) ? dateString.replace(/-/g,'\/') : dateString;
}
// 2018/08/08 to 2018-08-08
function dateStringToRequest(dateString){
    return /\//.test(dateString) ? dateString.replace(/\//g,'-') : dateString;
}

// 月份，天份 个位补0
function getFormatDate(arg) {
    if (arg == undefined || arg == '') {
        return '';
    }

    var re = arg + '';
    if (re.length < 2) {
        re = '0' + re;
    }
    return re;
}
//获取某一年的某一月有多少天
function mGetDate(year, month){
    var d = new Date(year, month, 0);
    return d.getDate();
}

class DataSearch extends Component{
    constructor(){
        super()
        var defaultBeginDate = addDate(getDateString(new Date),-6);    //默认开始日期
        var defaultEndDate = addDate(getDateString(new Date))       //默认结束日期
        this.defaultBeginDate = defaultBeginDate;
        this.defaultEndDate = defaultEndDate;
        this.state = {
            requested:false,
            tabIndex:0,
            totalPlayerNumber:0,     //上秤人数
            fatPeopleNumber:0,       //肥胖人数
            totalWechataddNumber:0,  //加粉人数
            playerNumberList:[],
            wechataddNumberList:[],
            data:[],                 //画图表需要的data数据
            beginDate:dateStringToPageShow(defaultBeginDate),
            endDate:dateStringToPageShow(defaultEndDate),
        }

        this.deviceArray = JSON.parse(window.localStorage.getItem('deviceArray'));
        this.deviceId = this.deviceArray[0].deviceId;
        this.deviceNo = this.deviceArray[0].deviceNo;
        this.bianlaId = window.localStorage.getItem('bianlaId');
        this.wxAuthorize = null;
        this.localURL = window.location.href;
    }
    componentWillMount(){
        this.wxAuthorize = authorize_url(`${this.localURL.split('#')[0]}#/autoLogin?`);
    }
    componentDidMount(){
        if(!this.bianlaId){
            sessionStorage.setItem('login_after_redirect_uri',this.localURL.split('#')[1]);
            window.location.href = this.wxAuthorize;
        }
        else{
            this.getDatas(this.state.beginDate,this.state.endDate);
        }
    }
    componentWillUnmount(){
        // this.setState = (state,callback)=>{
        //     return;
        // };
    }
    // 选项卡点击
    tabClick(tabIndex){
        // 重复点击同一个选项卡无效
        if(tabIndex === this.state.tabIndex){
            return;
        }

        this.setState({tabIndex:tabIndex})
        var beginDate,endDate,date = new Date();
        switch (tabIndex) {
            // 今日 /最近七天
            case 0:
                beginDate = this.defaultBeginDate
                endDate = this.defaultEndDate
                break;
            // 本周
            case 1:
                beginDate = addDate(getDateString(date),-(date.getDay()-1));
                endDate = addDate(getDateString(date));
                break;
            // 本月
            case 2:
                beginDate = addDate(getDateString(date),-(date.getDate()-1))
                endDate = addDate(getDateString(date))
                break;
            default:
                break;
        }
        this.getDatas(beginDate,endDate);
    }
    // 左边箭头点击
    leftArrowClick(){
        var tabIndex = this.state.tabIndex;
        var beginDate = dateStringToRequest(this.state.beginDate);
        var endDate = dateStringToRequest(this.state.endDate);

        switch (tabIndex) {
            // 往前一个七天
            case 0:
                beginDate = addDate(beginDate,-7);
                endDate = addDate(endDate,-7);
                break;
            // 往前一周
            case 1:
                endDate = addDate(beginDate,-1);
                beginDate = addDate(endDate,-6);
                break;
            // 往前一个月
            case 2:
                let tempBeginDate = beginDate.split('-');
                // 如果不是一月，则月份往前移
                if(tempBeginDate[1] != 1){
                    tempBeginDate[1] = getFormatDate(tempBeginDate[1] - 1);
                }
                // 否则年份往前移，月份归12
                else{
                    tempBeginDate[0] = (tempBeginDate[0] - 1).toString();
                    tempBeginDate[1] = '12';
                }
                beginDate = tempBeginDate.join('-');
                // 减1刚刚好是月底那一天，不减则会跑到下个月的第一天
                endDate = addDate(beginDate,mGetDate(tempBeginDate[0],tempBeginDate[1]) - 1);
                break;
            default:
                break;
        }
        this.getDatas(beginDate,endDate);
    }
    // 右边箭头点击
    rightArrowClick(){
        var tabIndex = this.state.tabIndex;
        var beginDate = dateStringToRequest(this.state.beginDate);
        var endDate = dateStringToRequest(this.state.endDate);
        // 如果结束日期是今天则不能继续看后面的数据
        if(endDate === this.defaultEndDate){
            Util.Toast('您无法查看未到日期的数据');
            return;
        }
        switch (tabIndex) {
            // 往后七天
            case 0:
                beginDate = addDate(beginDate,7);
                endDate = addDate(endDate,7);
                break;
            // 往前一周
            case 1:
                beginDate = addDate(endDate,1);
                endDate = addDate(beginDate,6);
                // 如果往后一周结束值大于今天，则设为今天
                if((new Date(endDate)).getTime() > (new Date(this.defaultEndDate)).getTime()){
                    endDate = this.defaultEndDate;
                }
                break;
            // 往前一个月
            case 2:
                let tempBeginDate;
                beginDate = addDate(endDate,1);
                tempBeginDate = beginDate.split('-');
                // 需要往后加多少天，跟据要显示的月份来获得
                let howDays = mGetDate(tempBeginDate[0],tempBeginDate[1]) - 1;
                
                endDate = addDate(beginDate,howDays);
                // 如果往后一个月结束值大于今天，则设为今天
                if((new Date(endDate)).getTime() > (new Date(this.defaultEndDate)).getTime()){
                    endDate = this.defaultEndDate;
                }
                break;
            default:
                break;
        }
        this.getDatas(beginDate,endDate);
    }
    // 请求此页面数据
    getDatas(beginDate,endDate){
        // 请求新数据之前先页面上显示的日期
        this.setState({
            beginDate:dateStringToPageShow(beginDate),
            endDate:dateStringToPageShow(endDate),
            requested:false,
        })
        req.get('数据查询',{deviceId:this.deviceId,beginDate:dateStringToRequest(beginDate),endDate:dateStringToRequest(endDate)},(result) =>{
            if(Math.abs(result.code === 401)){
                sessionStorage.setItem('login_after_redirect_uri',this.localURL.split('#')[1]);
                window.location.href = this.wxAuthorize;
            }
            if(result.code === 1){
                this.setState({
                    totalPlayerNumber:result.data.totalPlayerNumber,
                    fatPeopleNumber:result.data.fatPeopleNumber,
                    totalWechataddNumber:result.data.totalWechataddNumber,
                    playerNumberList:result.data.playerNumberList || [],
                    wechataddNumberList:result.data.wechataddNumberList || [],
                    requested:true,
                })
                this.concatDatas(this.state.playerNumberList,this.state.wechataddNumberList);
            }
            else{
                Util.Toast(result.alertMsg);
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
    // 将上秤人数与新增粉丝人数合并到一个json中，传给data渲染图表
    concatDatas(playerNumberList,wechataddNumberList){
        var tempData = [];
        playerNumberList.forEach((item,index) =>{
            // TODO:这里为了方便调试，加了假数据，回头得去掉
            // item.wechatAddNumber = parseInt(Math.random() * 20);
            // item.playerNumber = parseInt(Math.random() * 30);
            var oldCountData = item.countDate;
            oldCountData = oldCountData.split('-');
            oldCountData = oldCountData[1]+'/'+oldCountData[2]
            item.showCountDate = oldCountData;
            item.wechatAddNumber = 0;

            wechataddNumberList.forEach((item2,index) =>{
                if(item2.countDate === item.countDate){
                    item.wechatAddNumber = item2.wechatAddNumber
                }
            })
            tempData.push(item);
        })
        // alert(JSON.stringify(tempData))
        this.setState({
            data:tempData
        })
    }
    render(){
        return (
            <div className="App DataSearch">
                <DocumentTitle title="数据查询"></DocumentTitle>
                <div className="dataSearch-container">
                    <div className="green-block"></div>
                    <div className="current-device-block">
                        <div className="flex align-items-center">
                            <div className="flex1">
                                当前设备：<span>{this.deviceNo}</span>
                            </div>
                            <div>
                                <Link className="switch-device-btn" to="/index/deviceManagementHome/deviceManagement/switchDevice">切换</Link>
                            </div>
                        </div>
                    </div>
                    <div className="tabs-block">
                        <div className="tabs">
                            <ul>
                                <li className={this.state.tabIndex === 0 ? 'active' : ''} onClick={this.tabClick.bind(this,0)}>今日</li>
                                <li className={this.state.tabIndex === 1 ? 'active' : ''} onClick={this.tabClick.bind(this,1)}>本周</li>
                                <li className={this.state.tabIndex === 2 ? 'active' : ''} onClick={this.tabClick.bind(this,2)}>本月</li>
                            </ul>
                        </div>
                    </div>
                    <div className="peoples-block">
                        <div className="flex">
                            <Link className="flex1" to={`/index/dataSearch/playerNumber?beginDate=${dateStringToRequest(this.state.beginDate)}&endDate=${dateStringToRequest(this.state.endDate)}`}>
                                <p>上秤人数</p>
                                <h2>{this.state.totalPlayerNumber}</h2>
                                <div className="flex">
                                    <div className="flex1">
                                        <img src={you_jian_tou} alt=""/>
                                    </div>
                                </div>
                            </Link>
                            <div className="flex1">
                                <p>肥胖人数</p>
                                <h2>{this.state.fatPeopleNumber}</h2>
                                <div className="flex" style={{visibility:'hidden'}}>
                                    <div className="flex1">
                                        <img src={you_jian_tou} alt=""/>
                                    </div>
                                </div>
                            </div>
                            <Link className="flex1" to={`/index/dataSearch/wechatAddNumber?beginDate=${dateStringToRequest(this.state.beginDate)}&endDate=${dateStringToRequest(this.state.endDate)}`}>
                                <p>新增粉丝</p>
                                <h2>{this.state.totalWechataddNumber}</h2>
                                <div className="flex">
                                    <div className="flex1">
                                        <img src={you_jian_tou} alt=""/>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="fold-line-block">
                        <div className="date-block">
                            <table style={{width:'100%',borderSpacing:'0'}}>
                                <tbody>
                                    <tr>
                                        <td className="text-right" width="15%" onClick={this.leftArrowClick.bind(this)}><img className="left-arrow" src={you_jian_tou_png} alt=""/></td>
                                        <td className="text-center"><span>{this.state.beginDate}-{this.state.endDate}</span></td>
                                        <td className="text-left" width="15%" onClick={this.rightArrowClick.bind(this)}><img className="right-arrow" src={you_jian_tou_png} alt=""/></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="chart-block">
                            <div className="loading-yayer" style={{display:this.state.requested ? 'none' : 'block'}}>
                                <Loading />
                            </div>
                            <LineChart width={window.innerWidth} height={window.innerWidth * 0.64} data={this.state.data} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                                <Line type="monotone" dataKey="playerNumber" stroke="#40CC45" />
                                <Line type="monotone" dataKey="wechatAddNumber" stroke="#5EA6FF" />
                                <XAxis dataKey="showCountDate" fontSize='12px' />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                            </LineChart>
                            <div className="flex align-items-center text-center">
                                <div className="flex1"><span style={{verticalAlign:'middle',marginRight:'5px',fontSize:'12px',color:'#313131'}}>上秤</span><span className="line green" style={{verticalAlign:'middle'}}></span></div>
                                <div className="flex1"><span style={{verticalAlign:'middle',marginRight:'5px',fontSize:'12px',color:'#313131'}}>加粉</span><span className="line blue" style={{verticalAlign:'middle'}}></span></div>
                            </div>
                        </div>   
                    </div>
                </div>
            </div>
        )
    }
}

export default DataSearch
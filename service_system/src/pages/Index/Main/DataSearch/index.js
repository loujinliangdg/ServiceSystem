import React ,{Component} from 'react'
import {Link} from 'react-router-dom'
import DocumentTitle from '../../../../components/DocumentTitle'

import './assets/css/index.css'
import you_jian_tou from './assets/img/you-jian-tou02.png'
import req from '../../../../assets/js/req'
import Util from '../../../../components/Util'
import { Line,XAxis,CartesianGrid,LineChart,YAxis,Tooltip } from 'recharts';
import Loading from '../../../../components/Loading'
// import NoHaveMessage from '../../../../components/NoHaveMessage'
import you_jian_tou_png from '../../Question/assets/img/you_jian_tou_2x.png'
import authorize_url from '../../../../assets/js/authorize_url'
const qs = require('querystring')
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

//跟据传入的日期给出往前推几个月的日期
function pushForwardMonth(date,num){
    var nyr = date.split('-');
    var n = parseInt(nyr[0]);
    var y = parseInt(nyr[1]);
    var r = parseInt(nyr[2]);
    var a = num;//要往前推几个月
    if(y - a <= 0){
        n = n-1;
        y = y - a + 12;
    }
    else{
        y = y - a;
    }

    return `${n}-${getFormatDate(y)}-${getFormatDate(r)}`
}
//跟据传入的日期给出往后推几个月的日期
function pushBackMonth(date,num){
    var nyr = date.split('-');
    var n = parseInt(nyr[0]);
    var y = parseInt(nyr[1]);
    var r = parseInt(nyr[2]);
    var a = num;//要往前推几个月
    if(y + a > 12){
        n = n + 1;
        y = (y + a) - 12;
    }
    else{
        y = y + a;
    }

    return `${n}-${getFormatDate(y)}-${mGetDate(n,getFormatDate(y))}`
}

// 对今日，本周，本月 数据进行缓存
function buildDefaultGetFn(){
    let cacheData = {
        requested:false,
        totalPlayerNumber:0,     //上秤人数
        fatPeopleNumber:0,       //肥胖人数
        totalWechataddNumber:0,  //加粉人数
    }
    return function(beginDate,endDate){
        // 如果未请求过 取缓存中的
        if(cacheData.requested){
            this.setState({
                totalPlayerNumber:cacheData.totalPlayerNumber,
                fatPeopleNumber:cacheData.fatPeopleNumber,
                totalWechataddNumber:cacheData.totalWechataddNumber,
                normalBeginDate:beginDate,
                normalEndDate:endDate,
            })
        }
        else{
            req.get('数据查询',{deviceId:this.deviceId,beginDate:dateStringToRequest(beginDate),endDate:dateStringToRequest(endDate)},(result) =>{
                if(Math.abs(result.code === 401)){
                    sessionStorage.setItem('login_after_redirect_uri',this.localURL.split('#')[1]);
                    window.location.href = this.wxAuthorize;
                }
                if(result.code === 1){
                    // 存入缓存
                    cacheData.totalPlayerNumber = result.data.totalPlayerNumber;
                    cacheData.fatPeopleNumber = result.data.fatPeopleNumber;
                    cacheData.totalWechataddNumber = result.data.totalWechataddNumber;
                    cacheData.requested = true; 
                    // 更新数据
                    this.setState({
                        totalPlayerNumber:cacheData.totalPlayerNumber,
                        fatPeopleNumber:cacheData.fatPeopleNumber,
                        totalWechataddNumber:cacheData.totalWechataddNumber,
                        normalBeginDate:beginDate,
                        normalEndDate:endDate,
                    })
                }
                else{
                    Util.Toast(result.alertMsg);
                }
            },(error) =>{
                Util.Toast(error.toString());
            })
        }
    }.bind(this);
}

class DataSearch extends Component{
    constructor(){
        super()
        this.chartDefaultBeginDate = addDate(getDateString(new Date),-6);    //画图默认开始日期
        this.chartDefaultEndDate = addDate(getDateString(new Date));         //画图默认结束日期

        this.normalDefaultBeginDate = addDate(getDateString(new Date));
        this.normalDefaultEndDate = addDate(getDateString(new Date));

        this.state = {
            requested:false,
            tabIndex:null,
            totalPlayerNumber:0,     //显示--上秤人数
            fatPeopleNumber:0,       //显示--肥胖人数
            totalWechataddNumber:0,  //显示--加粉人数
            playerNumberList:[],
            wechataddNumberList:[],
            data:[],                 //画图表需要的data数据
            chartBeginDate:dateStringToPageShow(this.chartDefaultBeginDate), //画图表默认开始时间
            chartEndDate:dateStringToPageShow(this.chartDefaultEndDate),    //画图表默认结束时间
            normalBeginDate:dateStringToPageShow(this.normalDefaultBeginDate),  //上秤人数，肥肥人数，新增粉丝 默认开始时间
            normalEndDate:dateStringToPageShow(this.normalDefaultEndDate),      //上秤人数，肥肥人数，新增粉丝 默认结束时间
        }

        this.deviceArray = JSON.parse(window.localStorage.getItem('deviceArray'));
        this.deviceId = this.deviceArray[0].deviceId;
        this.deviceNo = this.deviceArray[0].deviceNo;
        this.bianlaId = window.localStorage.getItem('bianlaId');
        this.wxAuthorize = null;
        this.localURL = window.location.href;

        this.getThisDayData = buildDefaultGetFn.call(this)     //调用 今日数据的 函数
        this.getThisWeekData = buildDefaultGetFn.call(this)    //调用 本周数据的 函数
        this.getThisMonthData = buildDefaultGetFn.call(this)    //调用 本月数据的 函数
    }
    componentWillMount(){
        this.wxAuthorize = authorize_url(`${this.localURL.split('#')[0]}#/autoLogin?`);
    }
    componentDidMount(){
        // 重登录
        if(!this.bianlaId){
            sessionStorage.setItem('login_after_redirect_uri',this.localURL.split('#')[1]);
            window.location.href = this.wxAuthorize;
        }
        else{
            // 设置tabIndex
            var query = qs.parse(this.props.location.search.replace(/^\?&*/,''));
            // 初始化组件更新tabIndex
            this.setState({
                tabIndex:parseInt(query.tabIndex)
            })
        }
    }
    shouldComponentUpdate(nextProps, nextState){
        // 当tabIndex发生改变时去请求数据
        if(this.state.tabIndex !== nextState.tabIndex){
            this.tabIndexChangeGetData(nextState.tabIndex);
            // console.log(nextProps);
            return true;
        }
        else{
            return true
        }
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
    }
    getCurveType(){
        var arr = [
            'day',
            'week',
            'month'
        ]
        console.log(`获取： ${arr[this.state.tabIndex]} 数据...`);
        return arr[this.state.tabIndex];
    }
    // tabIndex变化，请求数据
    tabIndexChangeGetData(tabIndex){
        var beginDate,endDate,date = new Date();
        switch (tabIndex) {
            // 日 /最近七天
            case 0:
                beginDate = this.chartDefaultBeginDate
                endDate = this.chartDefaultEndDate
                // 获取今日
                // 上秤人数
                // 肥胖人数
                // 加粉人数
                this.getThisDayData(endDate,endDate)
                break;
            // 周 /本周及前四周
            case 1:
                // 4 * 7 = 4 周 再 加上本周（本周是几天，未知）
                let thisWeekBeginDate = addDate(getDateString(date),-(date.getDay()-1))
                beginDate = addDate(thisWeekBeginDate,-(4 * 7))
                endDate = addDate(getDateString(date));
                // 获取本周
                // 上秤人数
                // 肥胖人数
                // 加粉人数
                this.getThisWeekData(thisWeekBeginDate,endDate);
                break;
            // 月
            case 2:
                let thisMonthBeginDate = addDate(getDateString(date),-(date.getDate()-1));

                beginDate = addDate(pushForwardMonth(thisMonthBeginDate,5),0);
                // console.log(beginDate);
                endDate = addDate(getDateString(date))
                // 获取本月
                // 上秤人数
                // 肥胖人数
                // 加粉人数
                this.getThisMonthData(thisMonthBeginDate,endDate);
                break;
            default:
                break;
        }
        setTimeout(() =>{
            this.getDatas(beginDate,endDate,this.getCurveType());
        })
    }
    // 选项卡点击
    tabClick(tabIndex){
        // 重复点击同一个选项卡无效
        if(tabIndex === this.state.tabIndex){
            return;
        }
        this.props.history.replace(`/index/dataSearch/?tabIndex=${tabIndex}`);
        this.setState({tabIndex:tabIndex})
    }
    // 左边箭头点击
    leftArrowClick(){
        var tabIndex = this.state.tabIndex;
        var beginDate = dateStringToRequest(this.state.chartBeginDate);
        var endDate = dateStringToRequest(this.state.chartEndDate);

        switch (tabIndex) {
            // 往前一个七天
            case 0:
                beginDate = addDate(beginDate,-7);
                endDate = addDate(endDate,-7);
                break;
            // 往前五周
            case 1:
                endDate = addDate(beginDate,-1);
                beginDate = addDate(endDate,-6 + (-7 * 4));
                break;
            // 往前六个月
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
                // 开始时间再往前推5个月
                beginDate = pushForwardMonth(beginDate,5);
                break;
            default:
                break;
        }
        this.getDatas(beginDate,endDate,this.getCurveType());
    }
    // 右边箭头点击
    rightArrowClick(){
        var tabIndex = this.state.tabIndex;
        var beginDate = dateStringToRequest(this.state.chartBeginDate);
        var endDate = dateStringToRequest(this.state.chartEndDate);
        // 如果结束日期是今天则不能继续看后面的数据
        if(endDate === this.chartDefaultEndDate){
            Util.Toast('您无法查看未到日期的数据');
            return;
        }
        switch (tabIndex) {
            // 往后七天
            case 0:
                beginDate = addDate(beginDate,7);
                endDate = addDate(endDate,7);
                break;
            // 往后五周
            case 1:
                beginDate = addDate(endDate,1);
                endDate = addDate(beginDate,6 + (7 * 4));
                // 如果往后五周结束值大于今天，则设为今天
                if((new Date(endDate)).getTime() > (new Date(this.chartDefaultEndDate)).getTime()){
                    endDate = this.chartDefaultEndDate;
                }
                break;
            // 往前六个月
            case 2:
                let tempBeginDate;
                beginDate = addDate(endDate,1);
                tempBeginDate = beginDate.split('-');
                // 需要往后加多少天，跟据要显示的月份来获得
                let howDays = mGetDate(tempBeginDate[0],tempBeginDate[1]) - 1;
                
                endDate = pushBackMonth(beginDate,5)
                // addDate(beginDate,howDays);
                // 如果往后六个月结束值大于今天，则设为今天
                if((new Date(endDate)).getTime() > (new Date(this.chartDefaultEndDate)).getTime()){
                    endDate = this.chartDefaultEndDate;
                }
                break;
            default:
                break;
        }
        this.getDatas(beginDate,endDate,this.getCurveType());
    }
    // 请求此页面数据
    getDatas(beginDate,endDate,curveType){
        // 请求新数据之前先页面上显示的日期
        this.setState({
            chartBeginDate:dateStringToPageShow(beginDate),
            chartEndDate:dateStringToPageShow(endDate),
            requested:false,
        })
        req.get('获取折线图数据',{deviceId:this.deviceId,beginDate:dateStringToRequest(beginDate),endDate:dateStringToRequest(endDate),curveType:curveType},(result) =>{
            if(Math.abs(result.code === 401)){
                sessionStorage.setItem('login_after_redirect_uri',this.localURL.split('#')[1]);
                window.location.href = this.wxAuthorize;
            }
            if(result.code === 1){
                this.concatDatas(result.data.countNumberList || []);
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
    // 将后台给的数据再做一些处理 以附合渲染条件
    concatDatas(countNumberList){
        var tempData = [];
        countNumberList.map((item) =>{
            item['上秤人数'] = item.playerNumber;
            item['加粉人数'] = item.wechataddNumber;
            // 日 格式化日期
            if(item.countDate){
                let oldCountData = item.countDate;
                oldCountData = oldCountData.split('-');
                oldCountData = oldCountData[1]+'/'+oldCountData[2];
                item.showCountDate = oldCountData;
            }
            else{
                let beginDate = item.beginDate.split('-');
                let endDate = item.endDate.split('-');
                // 月 格式化日期
                if(this.state.tabIndex == 2){
                    item.showCountDate = beginDate[1] + '月';
                }
                // 周 格式化日期
                else{
                    item.showCountDate = beginDate[1] + '/' + beginDate[2] + '-' + endDate[1] + '/' + endDate[2];
                } 
            } 
        })

        this.setState({
            data:countNumberList,
            requested:true,
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
                            <div className="flex1 current-device">
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
                                <li className={this.state.tabIndex === 0 ? 'active' : ''} onClick={this.tabClick.bind(this,0)}>日</li>
                                <li className={this.state.tabIndex === 1 ? 'active' : ''} onClick={this.tabClick.bind(this,1)}>周</li>
                                <li className={this.state.tabIndex === 2 ? 'active' : ''} onClick={this.tabClick.bind(this,2)}>月</li>
                            </ul>
                        </div>
                    </div>
                    <p className="t">{this.state.tabIndex === 0 ? '今日' : (this.state.tabIndex === 1 ? '本周' : '本月')}</p>
                    <div className="peoples-block">
                        <div className="flex">
                            <Link className="flex1" to={`/index/dataSearch/playerNumber?beginDate=${dateStringToRequest(this.state.normalBeginDate)}&endDate=${dateStringToRequest(this.state.normalEndDate)}`}>
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
                            <Link className="flex1" to={`/index/dataSearch/wechatAddNumber?beginDate=${dateStringToRequest(this.state.normalBeginDate)}&endDate=${dateStringToRequest(this.state.normalEndDate)}`}>
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
                    <p className="t">与往日对比</p>
                    <div className="fold-line-block">
                        <h5 className="text-center">上秤人数和加粉人数折线图</h5>
                        <div className="date-block">
                            <table style={{width:'100%',borderSpacing:'0'}}>
                                <tbody>
                                    <tr>
                                        <td className="text-right" width="15%" onClick={this.leftArrowClick.bind(this)}><img className="left-arrow" src={you_jian_tou_png} alt=""/></td>
                                        <td className="text-center"><span>{this.state.chartBeginDate}-{this.state.chartEndDate}</span></td>
                                        <td className="text-left" width="15%" onClick={this.rightArrowClick.bind(this)}><img className="right-arrow" src={you_jian_tou_png} alt=""/></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="chart-block">
                            <div className="loading-yayer" style={{display:this.state.requested ? 'none' : 'block'}}>
                                <Loading />
                            </div>
                            <LineChart width={window.innerWidth} height={window.innerWidth * 0.64} data={this.state.data} margin={{ top: 10, right: 20, left: -25, bottom: 5 }}>
                                <Line type="monotone" dataKey="上秤人数" stroke="#40CC45" />
                                <Line type="monotone" dataKey="加粉人数" stroke="#5EA6FF" />
                                <XAxis dataKey="showCountDate" fontSize='12px' />
                                <YAxis />
                                <Tooltip cursor={{ stroke: '#666', strokeWidth: 1 }}/>
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
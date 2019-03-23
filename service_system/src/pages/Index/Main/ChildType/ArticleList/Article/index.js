import React,{PureComponent} from 'react'
import req from '@/assets/js/req'

import DocumentTitle from '@/components/DocumentTitle'
import Loading from '@/components/Loading'
import NoHaveMessage from '@/components/NoHaveMessage'
import Util from '@/components/Util'
import './assets/css/index.css'
import face_sad_png from './assets/img/face_sad.svg';
import face_smile_png from './assets/img/face_smile.svg';
import authorize_url from '@/assets/js/authorize_url'
import Wechat from '@/assets/js/wx-chat'
const qs = require('querystring')


/**
 * 获取微信jssdk配置参数
 */
function getWx(share) {
    req.get('获取微信配置信息',{},(result) =>{
        let wechat = new Wechat({
            debug: false,
            appId: result.data.appId,
            timestamp: result.data.timestamp,
            nonceStr: result.data.noncestr,
            signature: result.data.signature,
            jsApiList: ["onMenuShareAppMessage", "onMenuShareTimeline"]
        }).share({
            title: share.articleTitle, // 分享标题
            link: window.location.href, // 分享链接
            imgUrl:share.coverPicture, // 分享图标
            desc: share.description, // 分享描述
        })
    },(error) =>{

    })
}


// 获取当前年月日，代码网上拷的
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

class ArticleDetail extends PureComponent{
    constructor(props){
        super();
        this.query = {}
        this.state = {
            article:null,//文章
            requested:false,
            isClick:false,  //有用无用，是否点击过
        }
        this.bianlaId = window.localStorage.getItem('bianlaId');
        this.wxAuthorize = null;
        this.localURL = window.location.href;
    }
    componentWillMount(){
        this.query = qs.parse(this.props.location.search.replace(/^\?&*/,''));
        this.query.bianlaId = this.bianlaId;

        this.wxAuthorize = authorize_url(`${this.localURL.split('#')[0]}#/autoLogin?`);
        
    }
    componentDidMount() {
        // 如果本地没变啦id,并且不是预览模式
        if(!this.bianlaId && !this.query.timesTamp){
            sessionStorage.setItem('login_after_redirect_uri',this.localURL.split('#')[1]);
            window.location.href = this.wxAuthorize;
        }
        else {
            this.getList(this.query);
        }
    }
    getList(query){
        req.get(this.query.timesTamp ? '预览文章' : '根据文章id获取文章',query,(result) =>{
            if(Math.abs(result.code) === 401){
                sessionStorage.setItem('login_after_redirect_uri',this.localURL.split('#')[1]);
                window.location.href = this.wxAuthorize;
            }
            if(result.code === 1){
                var article = result.data.article || {};
                article.created = article.created || '2018-08-08';
                this.setState({
                    article,
                    requested:true,
                })
                getWx(article);
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
    Click(name,event){
        var api_name = `${name}数量统计`;
        if(this.query.timesTamp){
            Util.Toast('预览模式此功能不可用')
            return;
        }
        // 点了一次不准再点了
        if(this.state.isClick){
            return;
        }
        this.setState({isClick:name});
        req.get(api_name,{id:this.state.article.id},(result) =>{
            if(Math.abs(result.code) === 401){
                sessionStorage.setItem('login_after_redirect_uri',this.localURL.split('#')[1]);
                window.location.href = this.wxAuthorize;
            }
            if(result.code === 1){

            } 
        })
    }
    computedRenderContent(requested,article){
        // 未请求完成
        if(!requested){
            return <Loading />
        }
        // 请求完成无数据
        else if(requested && !article){
            return <NoHaveMessage />
        }
        // 有数据
        else{
            return (
                <div className="article">
                    <h1 className="article-title">{this.state.article.articleTitle}</h1>
                    {
                        !this.query.timesTamp ? <p className="created">发布日期：<span>{this.state.article.created.split(' ')[0]}</span></p> : <p className="created">预览日期：<span>{getNowFormatDate()}</span></p>
                    }
                    <div className="content" dangerouslySetInnerHTML={{__html:this.state.article.articleContent}}>

                    </div>
                    <div className="bottom">
                        <div className="useful-and-useless">
                            <div className={`flex align-items-center text-center ${this.state.isClick == '有用' ? 'on' : ''}`} onClick={this.Click.bind(this,'有用')}>
                                <div className="flex1" style={{marginRight:'-14px'}}>
                                    <svg t="1542271962309" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3035" width="15" height="15"><path d="M512 0C228.266667 0 0 228.266667 0 512s228.266667 512 512 512 512-228.266667 512-512S795.733333 0 512 0z m0 981.333333C253.866667 981.333333 42.666667 770.133333 42.666667 512S253.866667 42.666667 512 42.666667s469.333333 211.2 469.333333 469.333333-211.2 469.333333-469.333333 469.333333z"  p-id="3036"></path><path d="M256 448m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"  p-id="3037"></path><path d="M768 448m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"  p-id="3038"></path><path d="M712.533333 704c-57.6 42.666667-128 66.133333-200.533333 66.133333-72.533333 0-142.933333-23.466667-200.533333-66.133333-8.533333-6.4-23.466667-4.266667-29.866667 4.266667-6.4 8.533333-4.266667 23.466667 4.266667 29.866666 66.133333 49.066667 142.933333 74.666667 226.133333 74.666667 83.2 0 160-25.6 226.133333-74.666667 8.533333-6.4 10.666667-21.333333 4.266667-29.866666-6.4-10.666667-19.2-12.8-29.866667-4.266667z"  p-id="3039"></path></svg>
                                </div>
                                <div className="flex1"><span>有用</span></div>
                            </div>
                            <div className={`flex align-items-center text-center ${this.state.isClick == '无用' ? 'on' : ''}`} onClick={this.Click.bind(this,'无用')}>
                                <div className="flex1" style={{marginRight:'-14px'}}>
                                    <svg t="1542271935960" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2763" width="15" height="15"><path d="M512 0C228.266667 0 0 228.266667 0 512s228.266667 512 512 512 512-228.266667 512-512S795.733333 0 512 0z m0 981.333333C253.866667 981.333333 42.666667 770.133333 42.666667 512S253.866667 42.666667 512 42.666667s469.333333 211.2 469.333333 469.333333-211.2 469.333333-469.333333 469.333333z"  p-id="2764" data-spm-anchor-id="a313x.7781069.0.i0" class="selected"></path><path d="M256 448m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"  p-id="2765"></path><path d="M768 448m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z"  p-id="2766"></path><path d="M512 699.733333c-83.2 0-160 25.6-226.133333 74.666667-8.533333 6.4-10.666667 21.333333-4.266667 29.866667 6.4 8.533333 21.333333 10.666667 29.866667 4.266666 57.6-42.666667 128-66.133333 200.533333-66.133333 72.533333 0 142.933333 23.466667 200.533333 66.133333 4.266667 2.133333 8.533333 4.266667 12.8 4.266667 6.4 0 12.8-2.133333 17.066667-8.533333 6.4-8.533333 4.266667-23.466667-4.266667-29.866667-64-49.066667-142.933333-74.666667-226.133333-74.666667z"  p-id="2767"></path></svg>
                                </div>
                                <div className="flex1"><span>无用</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
    render(){
        return (
            <div className="App Article" style={{paddingTop:'1px'}}>
                <DocumentTitle title="文章详情"></DocumentTitle>
                {this.computedRenderContent(this.state.requested,this.state.article)}
            </div>
        )
    }
}
export default ArticleDetail
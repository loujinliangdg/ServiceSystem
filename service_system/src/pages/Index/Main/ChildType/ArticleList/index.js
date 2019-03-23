import React,{Component} from 'react'
import {Link,Switch,Route} from 'react-router-dom'
import DocumentTitle from '../../../../../components/DocumentTitle'
import ArticleDetail from './Article'
import req from '../../../../../assets/js/req'
import Loading from '../../../../../components/Loading'
import NoHaveMessage from '../../../../../components/NoHaveMessage'
import './assets/css/index.css'
import authorize_url from '../../../../../assets/js/authorize_url'
const qs = require('querystring');

class ArticleList extends Component{
    constructor(props) {
        super(props);
        this.query = {};
        this.state = {
            dataList:[], //分类列表
            requested:false,
        }
        this.bianlaId = window.localStorage.getItem('bianlaId');
        this.wxAuthorize = null;
        this.localURL = window.location.href;
    }
    componentWillMount() {
        this.query = qs.parse(this.props.location.search.slice(1));
        this.query.bianlaId = this.bianlaId;
        this.wxAuthorize = authorize_url(`${this.localURL.split('#')[0]}#/autoLogin?`);
    }
    componentDidMount() {
        if(!this.bianlaId){
            sessionStorage.setItem('login_after_redirect_uri',this.localURL.split('#')[1]);
            window.location.href = this.wxAuthorize;
        }
        else{
            this.getList(this.query);
        }
    }
    getTitleName(query){
        if(query.childType){
            return query.childType;
        }
        else{
            let titles = {
                cjwt:'常见问题',
                xwbg:'新闻报告'
            }
            return titles[query.type];
        }
    }
    getList(query){
        req.get(query.childType ? '根据子分类获取文章列表' : '根据类型获取文章列表',query,(result) =>{
            if(Math.abs(result.code) === 401){
                sessionStorage.setItem('login_after_redirect_uri',this.localURL.split('#')[1]);
                window.location.href = this.wxAuthorize;
            }
            if(result.code === 1){
                var dataList = result.data.articleList || []
                this.setState({
                    dataList,
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
            return this.state.dataList.map((item) =>{
                return (
                    <Link className="article-list-item flex align-items-center" key={item.id} to={`/index/childType/articleList/article?id=${item.id}`}>
                        <div className="coverPicture" style={{background:`url(${item.coverPicture}) no-repeat center center`,backgroundSize:'cover'}}></div>
                        <div className="flex1">
                            <p className="article-title">{item.articleTitle}</p>
                            <p className="desc">{item.description}</p>
                        </div>
                    </Link>
                )
            })
        }
    }
    render(){
        return (
            <div className="App Article2" style={{paddingTop:'1px'}}>
                <DocumentTitle title={this.getTitleName(this.query)}></DocumentTitle>
                {this.computedRenderContent(this.state.requested,this.state.dataList)}
            </div>
        )
    }
}

const ArticleListRoute = () =>{
    return (
        <Switch>
            <Route path="/index/childType/articleList" exact component={ArticleList} chineseName="文章列表"></Route>
            <Route path="/index/childType/articleList/article" component={ArticleDetail} chineseName="文章列表"></Route>
        </Switch>
    )
}


export default ArticleListRoute
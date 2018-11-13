import React,{Component,PureComponent} from 'react'
import req from '../../../../../../assets/js/req'

import DocumentTitle from '../../../../../../components/DocumentTitle'
import Loading from '../../../../../../components/Loading'
import NoHaveMessage from '../../../../../../components/NoHaveMessage'
import './assets/css/index.css'
const qs = require('querystring')

class Article extends PureComponent{
    constructor(props){
        super();
        this.query = {}
        this.state = {
            article:null,//文章
            requested:false,
        }
        this.bianlaId = window.localStorage.getItem('bianlaId');
    }
    componentWillMount(){
        this.query = qs.parse(this.props.location.search.slice(1));
        this.query.bianlaId = this.bianlaId;
    }
    componentDidMount() {
        this.getList(this.query);
    }
    getList(query){
        req.get('根据文章id获取文章',query,(result) =>{
            if(result.code === 1){
                var article = result.data.article || null
                this.setState({
                    article,
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
                    <div className="content" dangerouslySetInnerHTML={{__html:this.state.article.articleContent}}>

                    </div>
                </div>
            )
        }
        return <div></div>
    }
    render(){
        return (
            <div className="Article">
                <DocumentTitle title="文章详情"></DocumentTitle>
                {this.computedRenderContent(this.state.requested,this.state.article)}
            </div>
        )
    }
}
export default Article
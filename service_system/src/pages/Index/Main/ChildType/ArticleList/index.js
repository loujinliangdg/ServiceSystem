import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import DocumentTitle from '../../../../../components/DocumentTitle'

import req from '../../../../../assets/js/req'
import Loading from '../../../../../components/Loading'
import NoHaveMessage from '../../../../../components/NoHaveMessage'
import './assets/css/index.css'
const qs = require('querystring');

class Article extends Component{
    constructor(props) {
        super(props);
        this.query = {};
        this.state = {
            dataList:[], //分类列表
            requested:false,
        }
    }
    componentWillMount() {
        this.query = qs.parse(this.props.location.search.slice(1));
    }
    componentDidMount() {
        this.getList(this.query);
    }
    getList(query){
        req.get(query.childType ? '根据子分类获取文章列表' : '根据类型获取文章列表',query,(result) =>{
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
                            <p>{item.articleTitle}</p>
                        </div>
                    </Link>
                )
            })
        }
        return <div></div>
    }
    render(){
        return (
            <div className="Article2">
                <DocumentTitle title={this.query.childType ? this.query.childType : '成功案例'}></DocumentTitle>
                {this.computedRenderContent(this.state.requested,this.state.dataList)}
            </div>
        )
    }
}

export default Article
import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import DocumentTitle from '../../../../components/DocumentTitle'
import './assets/css/index.css'
import req from '../../../../assets/js/req'
import Loading from '../../../../components/Loading'
import NoHaveMessage from '../../../../components/NoHaveMessage'

const qs = require('querystring')

/**
 * 使用教程 文章列表
 */
class ArticleList extends Component{
    constructor(props){
        super(props)
        this.state = {
            dataList:[], //分类列表
            requested:false,
        }
        this.bianlaId = window.localStorage.getItem('bianlaId');
    }
    componentDidMount() {
        this.getList();
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
    }
    /**
     * 获取子分类列表
     */
    getList(){
        req.get('根据子分类获取文章列表',{type:this.props.postType,childType:this.props.childType,bianlaId:this.bianlaId},(result) =>{
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
    
    render(){
        return (
            <div className="ArticleList">
                {this.computedRenderContent(this.state.requested,this.state.dataList)}
            </div>
        )
    }
}

/**
 * 运营指南组件
 */
class YYZN extends Component {
    render(){
        return (
            <div className="yyzn">
            {
                this.props.dataList.map((item) =>{
                    return (
                        <Link className="yyzn-item" key={item.id} to={`/index/childType/articleList?type=${this.props.postType}&childType=${window.encodeURIComponent(item.classifyName)}`}>
                            <div className="coverUrl">
                                <div className="inner" style={{background:`url(${item.coverUrl}) no-repeat center center`,backgroundSize:'cover'}}></div>
                            </div>
                            <p className="classifyName">{item.classifyName}</p>
                        </Link>
                    )
                })
            }
            </div>
        )
    }
}

/**
 * 使用教程组件
 */
class SYJC extends Component {
    render(){
        return (
            <div className="syjc">
            {
                this.props.dataList.map((item) =>{
                    return (
                        <div className="syjc-inner" key={item.id}>
                            <h5 className="childType">{item.classifyName}</h5>
                            <ArticleList postType={this.props.postType} childType={item.classifyName}></ArticleList>
                        </div>
                    )
                })
            }
            </div>
        )
    }
}


class ChildType extends Component{
    constructor(props){
        super(props)
        this.state = {
            dataList:[], //分类列表
            requested:false,
        }
        this.postType = ''; //上级菜单名字
        this.bianlaId = window.localStorage.getItem('bianlaId');
    }
    componentWillMount() {
        var query = qs.parse(this.props.location.search.slice(1));
        this.postType = query.postType;
    }
    componentDidMount() {
        this.getList();
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
            if(this.postType === 'yyzn'){
                return <YYZN dataList={this.state.dataList} postType={this.postType}/>
            }
            else if(this.postType === 'syjc'){
                return <SYJC dataList={this.state.dataList} postType={this.postType}/>
            }
        }
    }
    /**
     * 获取子分类列表
     */
    getList(){
        req.get('根据文章类型获取子分类',{type:this.postType,bianlaId:this.bianlaId},(result) =>{
            if(result.code === 1){
                var dataList = result.data.customerServiceClassifyList || []
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
    
    render(){
        return (
            <div className="ChildType">
                <DocumentTitle title={this.postType === 'yyzn' ? '运营指南' : '使用教程'}></DocumentTitle>
                {this.computedRenderContent(this.state.requested,this.state.dataList)}
            </div>
        )
    }
}

export default ChildType
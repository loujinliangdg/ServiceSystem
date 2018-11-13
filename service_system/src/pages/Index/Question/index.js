import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import './assets/css/index.css'
import req from '../../../assets/js/req'
import Loading from '../../../components/Loading'
import NoHaveMessage from '../../../components/NoHaveMessage'

import you_jian_tou_png from './assets/img/you_jian_tou_2x.png'
import shuang_you_jian_tou_png from './assets/img/shuang_you_jian_tou_2x.png'


class Question extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataList:[], //分类列表
            requested:false,
        }
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
                    <li className="q-item body" key={item.id}>
                        <Link className="inner flex align-items-center"  to={`/index/childType/articleList/article?id=${item.id}`}>
                            <div className="flex1"><p>{item.articleTitle}</p></div>
                            <div className="text-right">
                                <span><img className="you-jian-tou" src={you_jian_tou_png} alt=""/></span>
                            </div>
                        </Link>
                    </li>
                )
            })
        }
    }
    /**
     * 获取子分类列表
     */
    getList(){
        req.get('置顶的常见问题',{type:this.props.postType},(result) =>{
            if(result.code === 1){
                var dataList = result.data.problemList || []
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
            <div className="Question">
                <ul className="q-list">
                    <li className="q-item head">
                        <div className="inner flex align-items-center">
                            <div className="flex1"><h3>常见问题</h3></div>
                            <div className="text-right">
                                <Link to="/index/childType/articleList?type=cjwt">更多<img className="shuang-you-jian-tou" src={shuang_you_jian_tou_png} alt=""/></Link>
                            </div>
                        </div>
                    </li>
                    {this.computedRenderContent(this.state.requested,this.state.dataList)}
                </ul>
            </div>
        )
    }
}

export default Question
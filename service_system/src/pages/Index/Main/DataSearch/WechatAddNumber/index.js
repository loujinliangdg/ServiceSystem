import React, { Component } from 'react';
import {LocalComponent} from '@/HightComponent'
import DocumentTitle from '@/components/DocumentTitle'
import './assets/css/index.css'
import req from '@/assets/js/req'
import Loading from '@/components/Loading'
import NoHaveMessage from '@/components/NoHaveMessage'

const qs = require('querystring')

class WechatAddNumber extends Component{
    constructor(){
        super();
        this.state = {
            requested:false,
            dataList:[],
        }
        this.beginDate = '';
        this.endDate = '';
    }
    componentWillMount(){
        var query = qs.parse(this.props.location.search.replace(/^\?&*/,''));
        this.beginDate = query.beginDate;
        this.endDate = query.endDate;
        this.getList();
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
    }
    /**
     * 获取新增粉丝人数
     */
    getList(){
        req.get('获取新增粉丝',{deviceId:this.props.deviceId,beginDate:this.beginDate,endDate:this.endDate},(result) =>{
            if(result.code === 1){
                var dataList = result.data.resultDatas || []
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
            return (
                <div className="wechatAddNumber-container">
                    <div className="list-title">
                        <div className="flex align-items-center">
                            <div style={{width:'4%',height:'1px'}}></div>
                            <div className="flex1"><span style={{marginLeft:'17%'}}>成员</span></div>
                            <div className="flex1 text-right"><span style={{marginRight:'17%'}}>人数</span></div>
                            <div style={{width:'4%',height:'1px'}}></div>
                        </div>
                    </div>
                    <div className="list-content">
                        {
                            dataList.map((item,index) =>{
                                return (
                                    <div className="list-item" key={index}>
                                        <h5 style={{fontSize:'13px',fontWeight:'100',color:'#9E9E9E',margin:'0 0 0 8.5%',lineHeight:'3'}}>{item.theDate}</h5>
                                        {
                                            item.powderDatas.map((item,index) =>{
                                                return (
                                                    <div className="flex align-items-center" key={index}>
                                                        <div className="flex1"><span style={{marginLeft:'17%'}}>{item.peopleName}</span></div>
                                                        <div className="flex1 text-right"><span style={{marginRight:'17%'}}>{item.addNumber}</span></div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                        <p style={{textAlign:'center',fontSize:'12px',color:'rgba(192,192,192,1)'}}>V辅助模式下，微信添加数量统计</p>
                    </div>
                </div>
            )
        }
    }
    render(){
        return (
            <div className="App wechatAddNumber">
                <DocumentTitle title="新增粉丝"></DocumentTitle>
                {
                    this.computedRenderContent(this.state.requested,this.state.dataList)
                }
            </div>
        )
    }
}

export default LocalComponent(WechatAddNumber)